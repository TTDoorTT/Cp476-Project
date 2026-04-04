import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

const PAGE_SIZE = 6;

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function MyContentPage() {
  const { user, loading } = useAuth();

  const [topics, setTopics] = useState([]);
  const [replies, setReplies] = useState([]);
  const [err, setErr] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("topics");
  const [page, setPage] = useState(1);

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

  function switchTab(nextTab) {
    setActiveTab(nextTab);
    setPage(1);
  }

  const currentItems = useMemo(() => {
    return activeTab === "topics" ? topics : replies;
  }, [activeTab, topics, replies]);

  const totalItems = currentItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pagedItems = currentItems.slice(startIndex, endIndex);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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
              My Posts
            </h2>
            <p className="page-subtitle">
              Switch between your topics and your replies.
            </p>
          </div>

          <div className="row">
            <button
              type="button"
              className={`btn ${activeTab === "topics" ? "primary" : ""}`}
              onClick={() => switchTab("topics")}
            >
              My Topics ({topics.length})
            </button>

            <button
              type="button"
              className={`btn ${activeTab === "replies" ? "primary" : ""}`}
              onClick={() => switchTab("replies")}
            >
              My Replies ({replies.length})
            </button>
          </div>
        </div>

        <p className="page-subtitle" style={{ marginTop: 12 }}>
          Showing page {safePage} of {totalPages} · {totalItems} total{" "}
          {activeTab === "topics"
            ? `topic${totalItems === 1 ? "" : "s"}`
            : `repl${totalItems === 1 ? "y" : "ies"}`}
        </p>

        {activeTab === "topics" ? (
          topics.length === 0 ? (
            <p className="empty-state" style={{ marginTop: 16 }}>
              You have not created any topics yet.
            </p>
          ) : (
            <div className="stack" style={{ marginTop: 14 }}>
              {pagedItems.map((topic) => (
                <article key={topic.id} className="card my-content-card">
                  <h3 className="topic-card-title">{topic.title}</h3>

                  <p className="topic-meta">
                    Created: {formatDateTime(topic.created_at)}
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
          )
        ) : replies.length === 0 ? (
          <p className="empty-state" style={{ marginTop: 16 }}>
            You have not posted any replies yet.
          </p>
        ) : (
          <div className="stack" style={{ marginTop: 14 }}>
            {pagedItems.map((reply) => (
              <article key={reply.id} className="card my-content-card">
                <p className="topic-meta">
                  Topic: <strong>{reply.topic_title}</strong>
                </p>

                <p className="topic-meta">
                  Posted: {formatDateTime(reply.created_at)}
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

        {totalItems > PAGE_SIZE ? (
          <div className="row" style={{ justifyContent: "space-between", marginTop: 18 }}>
            <button
              type="button"
              className="btn"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </button>

            <span className="page-subtitle" style={{ alignSelf: "center" }}>
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              className="btn"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}