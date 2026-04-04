import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function TopicDetailPage() {
  const { id } = useParams();
  const topicId = Number(id);

  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyBody, setReplyBody] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const [editingTopic, setEditingTopic] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyBody, setEditingReplyBody] = useState("");

  const [savingTopic, setSavingTopic] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState(false);
  const [postingReply, setPostingReply] = useState(false);
  const [savingReplyId, setSavingReplyId] = useState(null);
  const [deletingReplyId, setDeletingReplyId] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const canManageTopic =
    user && topic && (user.role === "admin" || user.id === topic.author_id);

  function canManageReply(reply) {
    return user && (user.role === "admin" || user.id === reply.author_id);
  }

  function confirmDeleteTopic() {
    return window.confirm(
      [
        "Delete this topic?",
        "",
        "This will soft delete the topic.",
        "It will disappear from normal users and topic lists.",
        "An admin can restore it later from the deleted topics view.",
      ].join("\n"),
    );
  }

  function confirmDeleteReply() {
    return window.confirm(
      [
        "Delete this reply?",
        "",
        "This will soft delete the reply.",
        "It will disappear from the discussion for normal users.",
        "An admin can restore it later from the deleted replies view.",
      ].join("\n"),
    );
  }

  async function loadAll() {
    setErr("");

    try {
      setPageLoading(true);

      const t = await api.getTopic(topicId);
      setTopic(t.topic);
      setEditTitle(t.topic.title);
      setEditBody(t.topic.body);

      const r = await api.listReplies(topicId);
      setReplies(r.replies || []);
    } catch (e) {
      setErr(e.message || "Failed to load topic");
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isInteger(topicId) || topicId <= 0) {
      setErr("Invalid topic id");
      setPageLoading(false);
      return;
    }
    loadAll();
  }, [topicId]);

  function startEditTopic() {
    setEditingTopic(true);
    setErr("");
    setInfo("");
  }

  function cancelEditTopic() {
    setEditingTopic(false);
    setEditTitle(topic?.title || "");
    setEditBody(topic?.body || "");
    setErr("");
    setInfo("");
  }

  async function onSaveTopic() {
    setErr("");
    setInfo("");

    const t = editTitle.trim();
    const b = editBody.trim();

    if (!t || !b) {
      setErr("Title and body are required.");
      return;
    }

    try {
      setSavingTopic(true);
      await api.updateTopic(topicId, t, b);
      setEditingTopic(false);
      setInfo("Topic updated.");
      await loadAll();
    } catch (e) {
      setErr(e.message || "Failed to update topic");
    } finally {
      setSavingTopic(false);
    }
  }

  function confirmDeleteTopic() {
    return window.confirm(
      [
        "Delete this topic?",
        "",
        "This will soft delete the topic.",
        "It will disappear from normal users and topic lists.",
        "An admin can restore it later from the deleted topics view.",
      ].join("\n"),
    );
  }

  function confirmDeleteReply() {
    return window.confirm(
      [
        "Delete this reply?",
        "",
        "This will soft delete the reply.",
        "It will disappear from the discussion for normal users.",
        "An admin can restore it later from the deleted replies view.",
      ].join("\n"),
    );
  }

  function startEditReply(reply) {
    setEditingReplyId(reply.id);
    setEditingReplyBody(reply.body);
    setErr("");
    setInfo("");
  }

  function cancelEditReply() {
    setEditingReplyId(null);
    setEditingReplyBody("");
    setErr("");
    setInfo("");
  }

  async function saveReplyEdit() {
    setErr("");
    setInfo("");

    const b = editingReplyBody.trim();
    if (!b) {
      setErr("Reply cannot be empty.");
      return;
    }

    try {
      setSavingReplyId(editingReplyId);
      await api.updateReply(editingReplyId, b);
      setEditingReplyId(null);
      setEditingReplyBody("");
      setInfo("Reply updated.");
      await loadAll();
    } catch (e) {
      setErr(e.message || "Failed to update reply");
    } finally {
      setSavingReplyId(null);
    }
  }

    async function deleteReply(replyId) {
    if (!confirmDeleteReply()) return;

    setErr("");
    setInfo("");

    try {
      setDeletingReplyId(replyId);
      await api.deleteReply(replyId);
      setInfo("Reply deleted.");
      await loadAll();
    } catch (e) {
      setErr(e.message || "Failed to delete reply");
    } finally {
      setDeletingReplyId(null);
    }
  }

  async function onSubmitReply(e) {
    e.preventDefault();
    setErr("");
    setInfo("");

    const text = replyBody.trim();
    if (!text) {
      setErr("Reply cannot be empty");
      return;
    }

    try {
      setPostingReply(true);
      await api.createReply(topicId, text);
      setReplyBody("");
      setInfo("Reply posted.");
      await loadAll();
    } catch (e) {
      setErr(e.message || "Failed to post reply");
    } finally {
      setPostingReply(false);
    }
  }

  if (pageLoading) {
    return (
      <main className="container page-section">
        <section className="card">
          <p className="status info">Loading topic...</p>
        </section>
      </main>
    );
  }

  if (err && !topic) {
    return (
      <main className="container page-section">
        <section className="card">
          <div className="form-actions">
            <Link className="btn" to="/topics">
              ← Back to Topics
            </Link>
          </div>

          <h1 className="page-title" style={{ marginTop: 12 }}>
            Topic Detail
          </h1>

          <p className="status error">{err}</p>
        </section>
      </main>
    );
  }

  if (!topic) {
    return (
      <main className="container page-section">
        <section className="card">
          <p className="status info">Loading topic...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container page-section">
      <section className="card">
        <div className="form-actions">
          <Link className="btn" to="/topics">
            ← Back to Topics
          </Link>
          {user ? (
            <Link className="btn primary" to="/topics/new">
              Create Topic
            </Link>
          ) : (
            <Link className="btn" to="/login">
              Login
            </Link>
          )}
        </div>

        {!editingTopic ? (
          <>
            <h1 className="page-title" style={{ marginTop: 12 }}>
              {topic.title}
            </h1>

            <p className="topic-meta">
              by <strong>{topic.author_username}</strong>{" "}
              {topic.updated_at ? "(edited)" : ""}
            </p>

            <div className="topic-body">{topic.body}</div>

            {canManageTopic ? (
              <div className="topic-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={startEditTopic}
                  disabled={deletingTopic}
                >
                  Edit Topic
                </button>
                <button
                  type="button"
                  className="btn danger"
                  onClick={onDeleteTopic}
                  disabled={deletingTopic}
                >
                  {deletingTopic ? "Deleting..." : "Delete Topic"}
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="page-title" style={{ marginTop: 12 }}>
              Edit Topic
            </h1>

            <form className="form-grid" style={{ marginTop: 16 }}>
              <div>
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  className="input"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  maxLength={150}
                  disabled={savingTopic}
                />
              </div>

              <div>
                <label htmlFor="edit-body">Body</label>
                <textarea
                  id="edit-body"
                  className="input"
                  rows={8}
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  disabled={savingTopic}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn primary"
                  onClick={onSaveTopic}
                  disabled={savingTopic}
                >
                  {savingTopic ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={cancelEditTopic}
                  disabled={savingTopic}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        {err ? <p className="status error">{err}</p> : null}
        {info ? <p className="status success">{info}</p> : null}
      </section>

      <section className="card">
        <h2 className="page-title" style={{ fontSize: "1.5rem" }}>
          Replies
        </h2>

        {replies.length === 0 ? (
          <p className="empty-state">No replies yet.</p>
        ) : (
          <div className="stack" style={{ marginTop: 14 }}>
            {replies.map((reply) => (
              <article key={reply.id} className="card reply-item">
                <p className="topic-meta">
                  <strong>{reply.author_username}</strong>{" "}
                  {reply.updated_at ? "(edited)" : ""}
                </p>

                {editingReplyId === reply.id ? (
                  <>
                    <textarea
                      className="input"
                      rows={5}
                      value={editingReplyBody}
                      onChange={(e) => setEditingReplyBody(e.target.value)}
                      disabled={savingReplyId === reply.id}
                      style={{ marginTop: 12 }}
                    />

                    <div className="reply-actions">
                      <button
                        type="button"
                        className="btn primary"
                        onClick={saveReplyEdit}
                        disabled={savingReplyId === reply.id}
                      >
                        {savingReplyId === reply.id ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={cancelEditReply}
                        disabled={savingReplyId === reply.id}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="reply-body">{reply.body}</div>

                    {canManageReply(reply) ? (
                      <div className="reply-actions">
                        <button
                          type="button"
                          className="btn"
                          onClick={() => startEditReply(reply)}
                          disabled={deletingReplyId === reply.id}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn danger"
                          onClick={() => deleteReply(reply.id)}
                          disabled={deletingReplyId === reply.id}
                        >
                          {deletingReplyId === reply.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h3 className="page-title" style={{ fontSize: "1.3rem" }}>
          Post a Reply
        </h3>

        <form
          onSubmit={onSubmitReply}
          className="form-grid"
          style={{ marginTop: 16 }}
        >
          <div>
            <label htmlFor="reply-body">Reply</label>
            <textarea
              id="reply-body"
              className="input"
              rows={6}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              disabled={postingReply}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn primary"
              disabled={postingReply}
            >
              {postingReply ? "Posting..." : "Submit Reply"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
