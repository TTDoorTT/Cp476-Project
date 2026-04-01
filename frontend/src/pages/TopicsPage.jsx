import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    api.listTopics()
      .then((data) => {
        if (!alive) return;
        setTopics(data.topics || []);
      })
      .catch((e) => setErr(e.message));
    return () => { alive = false; };
  }, []);

  return (
    <div>
      <h1>Topics</h1>
      <p>M3: topics loaded from backend.</p>

      {err && <p style={{ color: "#b00020" }}>{err}</p>}

      {topics.length === 0 ? (
        <p>No topics yet.</p>
      ) : (
        <ul>
          {topics.map((t) => (
            <li key={t.id}>
              <Link to={`/topics/${t.id}`}>{t.title}</Link>{" "}
              <small>by {t.author_username}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}