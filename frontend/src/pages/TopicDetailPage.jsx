import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
console.log("api keys:", Object.keys(api));
import { useAuth } from "../auth/AuthContext";

export default function TopicDetailPage() {
  const { id } = useParams();
  const topicId = Number(id);

  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);

  const [replyBody, setReplyBody] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // Topic edit state
  const [editingTopic, setEditingTopic] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  // Reply edit state
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyBody, setEditingReplyBody] = useState("");

  const canManageTopic =
    user && topic && (user.role === "admin" || user.id === topic.author_id);

  function canManageReply(r) {
    return user && (user.role === "admin" || user.id === r.author_id);
  }

  async function loadAll() {
    setErr("");
    setInfo("");
    try {
      const t = await api.getTopic(topicId);
      setTopic(t.topic);

      // Initialize edit fields from fresh data
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  // --- Topic handlers ---
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

  // --- Reply handlers ---
  function startEditReply(r) {
    setEditingReplyId(r.id);
    setEditingReplyBody(r.body);
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

  // --- Create reply ---
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

  // --- Render states ---
  if (err && !topic) {
    return (
      <div>
        <h1>Topic Detail</h1>
        <p style={{ color: "#b00020" }}>{err}</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div>
        <h1>Topic Detail</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Topic header */}
      {!editingTopic ? (
        <>
          <h1>{topic.title}</h1>
          <p>
            <small>
              by {topic.author_username} {topic.updated_at ? "(edited)" : ""}
            </small>
          </p>
          <p>{topic.body}</p>

          {canManageTopic && (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={startEditTopic}>Edit Topic</button>
              <button onClick={onDeleteTopic}>Delete Topic</button>
            </div>
          )}
        </>
      ) : (
        <>
          <h1>Edit Topic</h1>
          <label>Title</label>
          <input
            style={{ width: "100%", padding: 8, marginTop: 6, marginBottom: 12 }}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            maxLength={150}
          />

          <label>Body</label>
          <textarea
            rows={6}
            style={{ width: "100%", padding: 8, marginTop: 6, marginBottom: 12 }}
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onSaveTopic}>Save</button>
            <button onClick={cancelEditTopic}>Cancel</button>
          </div>
        </>
      )}

      {/* Status messages */}
      <h2 style={{ marginTop: 24 }}>Replies</h2>
      {err && <p style={{ color: "#b00020" }}>{err}</p>}
      {info && <p style={{ color: "green" }}>{info}</p>}

      {/* Replies list */}
      {replies.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {replies.map((r) => (
            <li key={r.id} style={{ marginBottom: 12 }}>
              <div>
                <b>{r.author_username}</b>
                {r.updated_at ? <small> (edited)</small> : null}
              </div>

              {editingReplyId === r.id ? (
                <>
                  <textarea
                    rows={3}
                    style={{ width: "100%", marginTop: 6 }}
                    value={editingReplyBody}
                    onChange={(e) => setEditingReplyBody(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button onClick={saveReplyEdit}>Save</button>
                    <button onClick={cancelEditReply}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginTop: 4 }}>{r.body}</div>

                  {canManageReply(r) && (
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <button onClick={() => startEditReply(r)}>Edit</button>
                      <button onClick={() => deleteReply(r.id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Create reply */}
      <h3 style={{ marginTop: 24 }}>Post a Reply</h3>
      <form onSubmit={onSubmitReply}>
        <textarea
          rows={4}
          style={{ width: "100%" }}
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
        />
        <button type="submit" style={{ marginTop: 8 }}>
          Submit Reply
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Note: Posting/editing/deleting requires being logged in. Owner/admin rules are enforced by the backend.
      </p>
    </div>
  );
}