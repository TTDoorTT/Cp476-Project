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
  const [info, setInfo] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");

    const t = title.trim();
    const b = body.trim();

    if (!t || !b) {
      setErr("Title and body are required.");
      return;
    }

    try {
      const created = await api.createTopic(t, b);
      setInfo("Topic created.");
      navigate(`/topics/${created.id}`);
    } catch (e2) {
      setErr(e2.message || "Failed to create topic");
    }
  }

  if (loading) {
    return (
      <main className="container page-section">
        <section className="card">
          <p>Checking session…</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container page-section">
        <section className="card auth-layout">
          <h1 className="page-title">Create Topic</h1>
          <p className="page-subtitle">
            You must be logged in to create a topic.
          </p>

          <div className="form-actions" style={{ marginTop: 16 }}>
            <button className="btn primary" onClick={() => navigate("/login")}>
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
    <main className="container page-section auth-layout">
      <section className="card">
        <h1 className="page-title">Create Topic</h1>
        <p className="page-subtitle">Logged in as {user.username}</p>

        {err ? <p className="status error">{err}</p> : null}
        {info ? <p className="status success">{info}</p> : null}

        <form onSubmit={onSubmit} className="form-grid" style={{ marginTop: 16 }}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className="input"
              type="text"
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              Create
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
