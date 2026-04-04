import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function CreateTopicPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const t = title.trim();
    const b = body.trim();

    if (!t || !b) {
      setErr("Title and body are required.");
      return;
    }

    try {
      setSubmitting(true);
      const created = await api.createTopic(t, b);
      navigate(`/topics/${created.id}`);
    } catch (e2) {
      setErr(e2.message || "Failed to create topic");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="container page-section">
        <section className="card">
          <p className="status info">Checking session...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Create Topic</h1>
          <p className="page-subtitle">You must be logged in to create a topic.</p>

          <div className="form-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>

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
        <h1 className="page-title">Create Topic</h1>
        <p className="page-subtitle">Logged in as {user.username}</p>

        {err ? <p className="status error">{err}</p> : null}

        <form onSubmit={onSubmit} className="form-grid" style={{ marginTop: 16 }}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              className="input"
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? "Creating Topic..." : "Create"}
            </button>

            <Link className="btn" to="/topics">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}