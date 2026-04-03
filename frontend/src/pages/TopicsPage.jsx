import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [err, setErr] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    let alive = true;

    api
      .listTopics()
      .then((data) => {
        if (!alive) return;
        setTopics(data.topics || []);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e.message);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="container page-section">
      <section className="card">
        <div className="row page-head">
          <div style={{ flex: 1, minWidth: "240px" }}>
            <h1 className="page-title">Topics</h1>
            <p className="page-subtitle">
              Browse all forum discussions.
            </p>
          </div>

          <div className="row">
            {user ? (
              <Link className="btn primary" to="/topics/new">
                + Create Topic
              </Link>
            ) : (
              <Link className="btn" to="/login">
                Login to Post
              </Link>
            )}
          </div>
        </div>

        {err ? <p className="status error">{err}</p> : null}

        {topics.length === 0 ? (
          <p className="empty-state">No topics yet.</p>
        ) : (
          <div className="stack" style={{ marginTop: 16 }}>
            {topics.map((t) => {
              const preview = String(t.body || "");
              const shortPreview =
                preview.length > 180 ? `${preview.slice(0, 180)}...` : preview;

              return (
                <article key={t.id} className="card topic-card">
                  <h2 className="topic-card-title">
                    <Link to={`/topics/${t.id}`}>{t.title}</Link>
                  </h2>

                  <p className="topic-meta">by {t.author_username}</p>

                  {shortPreview ? (
                    <p className="topic-preview">{shortPreview}</p>
                  ) : null}

                  <Link className="btn" to={`/topics/${t.id}`}>
                    Open Topic
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
