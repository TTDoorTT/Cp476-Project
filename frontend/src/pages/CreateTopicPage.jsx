import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  if (loading) return <p>Checking session…</p>;

  // Optional: block page if not logged in
  if (!user) {
    return (
      <div>
        <h1>Create Topic</h1>
        <p style={{ color: "#b00020" }}>You must be logged in to create a topic.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h1>Create Topic</h1>
      <p>Logged in as <b>{user.username}</b></p>

      {err && <p style={{ color: "#b00020" }}>{err}</p>}
      {info && <p style={{ color: "green" }}>{info}</p>}

      <form onSubmit={onSubmit}>
        <label>Title</label>
        <input
          style={{ width: "100%", padding: 8, marginTop: 6, marginBottom: 12 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={150}
        />

        <label>Body</label>
        <textarea
          rows={6}
          style={{ width: "100%", padding: 8, marginTop: 6, marginBottom: 12 }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}