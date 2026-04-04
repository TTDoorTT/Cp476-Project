import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function AdminDeletedTopicsPage() {
  const { user, loading } = useAuth();
  const [topics, setTopics] = useState([]);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [restoringId, setRestoringId] = useState(null);

  async function loadDeletedTopics() {
    setErr("");

    try {
      const data = await api.listDeletedTopics();
      setTopics(data.topics || []);
    } catch (e) {
      setErr(e.message || "Failed to load deleted topics");
    }
  }

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    loadDeletedTopics();
  }, [user]);

  async function onRestore(topicId) {
    setErr("");
    setInfo("");

    try {
      setRestoringId(topicId);
      await api.restoreTopicAdmin(topicId);
      setInfo(`Topic #${topicId} restored.`);
      await loadDeletedTopics();
    } catch (e) {
      setErr(e.message || "Failed to restore topic");
    } finally {
      setRestoringId(null);
    }
  }

  if (loading) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Deleted Topics</h1>
          <p className="page-subtitle">Checking session...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Deleted Topics</h1>
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
          <h1 className="page-title">Deleted Topics</h1>
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
            <h1 className="page-title">Deleted Topics</h1>
            <p className="page-subtitle">
              Admin view of soft-deleted topics.
            </p>
          </div>

          <div className="row">
            <Link className="btn" to="/admin/users">
              View Users
            </Link>
            <Link className="btn" to="/topics">
              Back to Topics
            </Link>
          </div>
        </div>

        {err ? <p className="status error">{err}</p> : null}
        {info ? <p className="status success">{info}</p> : null}

        {topics.length === 0 ? (
          <p className="empty-state">No deleted topics found.</p>
        ) : (
          <div className="admin-grid">
            {topics.map((topic) => (
              <article key={topic.id} className="card admin-item">
                <div className="admin-item-top">
                  <div>
                    <h2 className="admin-item-title">
                      #{topic.id} — {topic.title}
                    </h2>
                    <p className="topic-meta">
                      Author: <strong>{topic.author_username}</strong>
                    </p>
                  </div>

                  <span className="role-badge admin-danger-badge">
                    Deleted
                  </span>
                </div>

                <p className="admin-meta">
                  Created: {new Date(topic.created_at).toLocaleString()}
                </p>
                <p className="admin-meta">
                  Deleted: {new Date(topic.deleted_at).toLocaleString()}
                </p>

                <div className="topic-preview">
                  {topic.body?.length > 280
                    ? `${topic.body.slice(0, 280)}...`
                    : topic.body}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn primary"
                    disabled={restoringId === topic.id}
                    onClick={() => onRestore(topic.id)}
                  >
                    {restoringId === topic.id ? "Restoring..." : "Restore"}
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