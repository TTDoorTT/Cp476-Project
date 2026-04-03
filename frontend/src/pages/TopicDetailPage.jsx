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

  const [editingTopic, setEditingTopic] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyBody, setEditingReplyBody] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const canManageTopic =
    user && topic && (user.role === "admin" || user.id === topic.author_id);

  function canManageReply(reply) {
    return user && (user.role === "admin" || user.id === reply.author_id);
  }

  async function loadAll() {
    setErr("");
    setInfo("");

    try {
      const t = await api.getTopic(topicId);
      setTopic(t.topic);
      setEditTitle(t.topic.title);
      setEditBody(t.topic.body);

      const r = await api.listReplies(topicId);
      setReplies(r.replies || []);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    if (!Number.isInteger(topicId) || topicId <= 0) {
      setErr("Invalid topic id");
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
      await api.updateTopic(topicId, t, b);
      setEditingTopic(false);
      setInfo("Topic updated.");
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function onDeleteTopic() {
    if (!confirm("Delete this topic?")) return;

    setErr("");
    setInfo("");

    try {
      await api.deleteTopic(topicId);
      navigate("/topics");
    } catch (e) {
      setErr(e.message);
    }
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
      await api.updateReply(editingReplyId, b);
      setEditingReplyId(null);
      setEditingReplyBody("");
      setInfo("Reply updated.");
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function deleteReply(replyId) {
    if (!confirm("Delete this reply?")) return;

    setErr("");
    setInfo("");

    try {
      await api.deleteReply(replyId);
      setInfo("Reply deleted.");
      await loadAll();
    } catch (e) {
      setErr(e.message);
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
      await api.createReply(topicId, text);
      setReplyBody("");
      setInfo("Reply posted.");
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  if (err && !topic) {
    return (
      <main className="container page-section">
        <section className="card">
          <Link className="back-link" to="/topics">
            ← Back to Topics
          </Link>
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
          <Link className="back-link" to="/topics">
            ← Back to Topics
          </Link>
          <h1 className="page-title" style={{ marginTop: 12 }}>
            Topic Detail
          </h1>
          <p>Loading...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container page-section">
      <div className="row page-head" style={{ marginBottom: 14 }}>
        <Link className="back-link" to="/topics">
          ← Back to Topics
        </Link>

        {user ? (
          <Link className="btn" to="/topics/new">
            Create Topic
          </Link>
        ) : (
          <Link className="btn" to="/login">
            Login
          </Link>
        )}
      </div>

      <section className="card">
        {!editingTopic ? (
          <>
            <h1 className="page-title">{topic.title}</h1>
            <p className="topic-meta">
              by {topic.author_username}
              {topic.updated_at ? " (edited)" : ""}
            </p>
            <p className="topic-body">{topic.body}</p>

            {canManageTopic ? (
              <div className="topic-actions">
                <button type="button" className="btn" onClick={startEditTopic}>
                  Edit Topic
                </button>
                <button
                  type="button"
                  className="btn danger"
                  onClick={onDeleteTopic}
                >
                  Delete Topic
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="page-title">Edit Topic</h1>

            <div className="form-grid" style={{ marginTop: 16 }}>
              <div>
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  className="input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  maxLength={150}
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
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn primary" onClick={onSaveTopic}>
                  Save
                </button>
                <button type="button" className="btn" onClick={cancelEditTopic}>
                  Cancel
                </button>
              </div>
            </div>
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
          <div className="stack" style={{ marginTop: 16 }}>
            {replies.map((reply) => (
              <article key={reply.id} className="card reply-item">
                <p className="topic-meta">
                  <strong>{reply.author_username}</strong>
                  {reply.updated_at ? " (edited)" : ""}
                </p>

                {editingReplyId === reply.id ? (
                  <>
                    <textarea
                      className="input"
                      rows={4}
                      value={editingReplyBody}
                      onChange={(e) => setEditingReplyBody(e.target.value)}
                    />

                    <div className="reply-actions">
                      <button
                        type="button"
                        className="btn primary"
                        onClick={saveReplyEdit}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={cancelEditReply}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="reply-body">{reply.body}</p>

                    {canManageReply(reply) ? (
                      <div className="reply-actions">
                        <button
                          type="button"
                          className="btn"
                          onClick={() => startEditReply(reply)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn danger"
                          onClick={() => deleteReply(reply.id)}
                        >
                          Delete
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
        <h3 className="page-title" style={{ fontSize: "1.25rem" }}>
          Post a Reply
        </h3>

        <form onSubmit={onSubmitReply} className="form-grid" style={{ marginTop: 16 }}>
          <div>
            <label htmlFor="reply-body">Reply</label>
            <textarea
              id="reply-body"
              className="input"
              rows={5}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              Submit Reply
            </button>
          </div>
        </form>

        <p className="auth-note">
          Posting, editing, and deleting are enforced by the backend owner/admin rules.
        </p>
      </section>
    </main>
  );
}
