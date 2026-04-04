import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function AdminDeletedRepliesPage() {
  const { user, loading } = useAuth();
  const [replies, setReplies] = useState([]);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [restoringId, setRestoringId] = useState(null);

  async function loadDeletedReplies() {
    setErr("");

    try {
      const data = await api.listDeletedReplies();
      setReplies(data.replies || []);
    } catch (e) {
      setErr(e.message || "Failed to load deleted replies");
    }
  }

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    loadDeletedReplies();
  }, [user]);

  async function onRestore(replyId) {
    setErr("");
    setInfo("");

    try {
      setRestoringId(replyId);
      await api.restoreReplyAdmin(replyId);
      setInfo(`Reply #${replyId} restored.`);
      await loadDeletedReplies();
    } catch (e) {
      setErr(e.message || "Failed to restore reply");
    } finally {
      setRestoringId(null);
    }
  }

  if (loading) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Deleted Replies</h1>
          <p className="status info">Checking session...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Deleted Replies</h1>
          <p className="status error">You must be logged in.</p>
          <div className="form-actions">
            <Link className="btn primary" to="/login">
              Go to Login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (user.role !== "admin") {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Deleted Replies</h1>
          <p className="status error">Admin only.</p>
          <div className="form-actions">
            <Link className="btn" to="/topics">
              Back to Topics
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container page-section">
      <section className="card">
        <div className="row page-head">
          <div style={{ flex: 1, minWidth: "240px" }}>
            <h1 className="page-title">Deleted Replies</h1>
            <p className="page-subtitle">
              Admin view of soft-deleted replies.
            </p>
          </div>

          <div className="row">
            <Link className="btn" to="/admin/deleted-topics">
              Deleted Topics
            </Link>
            <Link className="btn" to="/admin/users">
              Users
            </Link>
            <Link className="btn" to="/topics">
              Back to Topics
            </Link>
          </div>
        </div>

        {err ? <p className="status error">{err}</p> : null}
        {info ? <p className="status success">{info}</p> : null}

        {replies.length === 0 ? (
          <p className="empty-state">No deleted replies found.</p>
        ) : (
          <div className="admin-grid">
            {replies.map((reply) => (
              <article key={reply.id} className="card admin-item">
                <div className="admin-item-top">
                  <div>
                    <h2 className="admin-item-title">
                      Reply #{reply.id} · Topic #{reply.topic_id}
                    </h2>
                    <p className="topic-meta">
                      Author: <strong>{reply.author_username}</strong>
                    </p>
                    <p className="topic-meta">
                      Topic: <strong>{reply.topic_title}</strong>
                    </p>
                  </div>

                  <span className="role-badge admin-danger-badge">
                    Deleted
                  </span>
                </div>

                <p className="admin-meta">
                  Created: {new Date(reply.created_at).toLocaleString()}
                </p>
                <p className="admin-meta">
                  Deleted: {new Date(reply.deleted_at).toLocaleString()}
                </p>

                <div className="topic-preview">
                  {reply.body?.length > 320
                    ? `${reply.body.slice(0, 320)}...`
                    : reply.body}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn primary"
                    disabled={restoringId === reply.id}
                    onClick={() => onRestore(reply.id)}
                  >
                    {restoringId === reply.id ? "Restoring..." : "Restore"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}