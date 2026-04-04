import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function MyContentPage() {
  const { user, loading } = useAuth();

  const [topics, setTopics] = useState([]);
  const [replies, setReplies] = useState([]);
  const [err, setErr] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let alive = true;

    async function loadMyContent() {
      setErr("");

      try {
        setPageLoading(true);

        const [topicsData, repliesData] = await Promise.all([
          api.listMyTopics(),
          api.listMyReplies(),
        ]);

        if (!alive) return;

        setTopics(topicsData.topics || []);
        setReplies(repliesData.replies || []);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load your content");
      } finally {
        if (alive) setPageLoading(false);
      }
    }

    loadMyContent();

    return () => {
      alive = false;
    };
  }, [user]);

  if (loading) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">My Content</h1>
          <p className="status info">Checking session...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">My Content</h1>
          <p className="status error">You must be logged in to view this page.</p>
          <div className="form-actions">
            <Link className="btn primary" to="/login">
              Go to Login
            </Link>
            <Link className="btn" to="/topics">
              Back to Topics
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (pageLoading) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">My Content</h1>
          <p className="status info">Loading your topics and replies...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container page-section">
      <section className="card">
        <div className="row page-head">
          <div style={{ flex: 1, minWidth: "240px" }}>
            <h1 className="page-title">My Content</h1>
            <p className="page-subtitle">
              View everything you have posted as <strong>{user.username}</strong>.
            </p>
          </div>

          <div className="row">
            <Link className="btn primary" to="/topics/new">
              Create Topic
            </Link>
            <Link className="btn" to="/topics">
              Back to Topics
            </Link>
          </div>
        </div>

        {err ? <p className="status error">{err}</p> : null}

        <div className="my-content-summary">
          <article className="my-summary-card">
            <p className="my-summary-label">My Topics</p>
            <p className="my-summary-value">{topics.length}</p>
          </article>

          <article className="my-summary-card">
            <p className="my-summary-label">My Replies</p>
            <p className="my-summary-value">{replies.length}</p>
          </article>
        </div>
      </section>

      <section className="card">
        <div className="row page-head">
          <div>
            <h2 className="page-title" style={{ fontSize: "1.4rem" }}>
              My Topics
            </h2>
            <p className="page-subtitle">Topics you created.</p>
          </div>
        </div>

        {topics.length === 0 ? (
          <p className="empty-state">You have not created any topics yet.</p>
        ) : (
          <div className="stack" style={{ marginTop: 14 }}>
            {topics.map((topic) => (
              <article key={topic.id} className="card my-content-card">
                <h3 className="topic-card-title">{topic.title}</h3>

                <p className="topic-meta">
                  Created: {new Date(topic.created_at).toLocaleString()}
                  {topic.updated_at ? " · Updated" : ""}
                </p>

                <div className="topic-preview">
                  {topic.body?.length > 220
                    ? `${topic.body.slice(0, 220)}...`
                    : topic.body}
                </div>

                <div className="form-actions">
                  <Link className="btn" to={`/topics/${topic.id}`}>
                    Open Topic
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="row page-head">
          <div>
            <h2 className="page-title" style={{ fontSize: "1.4rem" }}>
              My Replies
            </h2>
            <p className="page-subtitle">Replies you posted in discussions.</p>
          </div>
        </div>

        {replies.length === 0 ? (
          <p className="empty-state">You have not posted any replies yet.</p>
        ) : (
          <div className="stack" style={{ marginTop: 14 }}>
            {replies.map((reply) => (
              <article key={reply.id} className="card my-content-card">
                <p className="topic-meta">
                  Topic: <strong>{reply.topic_title}</strong>
                </p>

                <p className="topic-meta">
                  Posted: {new Date(reply.created_at).toLocaleString()}
                  {reply.updated_at ? " · Updated" : ""}
                </p>

                <div className="topic-preview">
                  {reply.body?.length > 260
                    ? `${reply.body.slice(0, 260)}...`
                    : reply.body}
                </div>

                <div className="form-actions">
                  <Link className="btn" to={`/topics/${reply.topic_id}`}>
                    Go to Topic
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}