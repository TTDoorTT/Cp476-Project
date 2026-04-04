import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [ownershipFilter, setOwnershipFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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
        setErr(e.message || "Failed to load topics");
      });

    return () => {
      alive = false;
    };
  }, []);

  const filteredTopics = useMemo(() => {
    const q = search.trim().toLowerCase();

    let result = [...topics];

    if (ownershipFilter === "mine" && user) {
      result = result.filter((t) => t.author_id === user.id);
    }

    if (q) {
      result = result.filter((t) => {
        const title = String(t.title || "").toLowerCase();
        const author = String(t.author_username || "").toLowerCase();
        return title.includes(q) || author.includes(q);
      });
    }

    result.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }

      if (sortBy === "title-asc") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }

      if (sortBy === "title-desc") {
        return String(b.title || "").localeCompare(String(a.title || ""));
      }

      // newest
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return result;
  }, [topics, search, ownershipFilter, sortBy, user]);

  function resetControls() {
    setSearch("");
    setOwnershipFilter("all");
    setSortBy("newest");
  }

  return (
    <main className="container page-section">
      <section className="card">
        <div className="row page-head">
          <div style={{ flex: 1, minWidth: "240px" }}>
            <h1 className="page-title">Topics</h1>
            <p className="page-subtitle">Browse all forum discussions.</p>
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

        <div className="topics-toolbar">
          <div className="topics-toolbar-group topics-search-group">
            <label htmlFor="topic-search">Search</label>
            <input
              id="topic-search"
              className="input"
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="topics-toolbar-group">
            <label htmlFor="ownership-filter">View</label>
            <select
              id="ownership-filter"
              className="input"
              value={ownershipFilter}
              onChange={(e) => setOwnershipFilter(e.target.value)}
              disabled={!user}
            >
              <option value="all">All Topics</option>
              <option value="mine">My Topics</option>
            </select>
          </div>

          <div className="topics-toolbar-group">
            <label htmlFor="sort-by">Sort</label>
            <select
              id="sort-by"
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        <div className="topics-toolbar-footer">
          <p className="small">
            Showing {filteredTopics.length} of {topics.length} topic
            {topics.length === 1 ? "" : "s"}
          </p>

          {(search || ownershipFilter !== "all" || sortBy !== "newest") && (
            <button type="button" className="btn" onClick={resetControls}>
              Reset Filters
            </button>
          )}
        </div>

        {filteredTopics.length === 0 ? (
          <div className="empty-state-block">
            <p className="empty-state">No topics match your current filters.</p>
            <p className="small">
              Try clearing the search, switching the view, or changing the sort.
            </p>
          </div>
        ) : (
          <div className="stack" style={{ marginTop: 16 }}>
            {filteredTopics.map((t) => (
              <article key={t.id} className="card topic-card">
                <h2 className="topic-card-title">{t.title}</h2>

                <p className="topic-meta">
                  by <strong>{t.author_username}</strong>
                </p>

                <div className="form-actions">
                  <Link className="btn" to={`/topics/${t.id}`}>
                    Open Topic
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