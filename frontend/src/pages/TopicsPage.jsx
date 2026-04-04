import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

const PAGE_SIZE = 10;

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [err, setErr] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  });

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [ownershipFilter, setOwnershipFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const { user } = useAuth();

  useEffect(() => {
    let alive = true;

    api
      .listTopics({
        page,
        limit: PAGE_SIZE,
        q: appliedSearch,
        sort: sortBy,
        scope: ownershipFilter,
      })
      .then((data) => {
        if (!alive) return;
        setTopics(data.topics || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 1,
            hasPrev: false,
            hasNext: false,
          }
        );
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e.message || "Failed to load topics");
      });

    return () => {
      alive = false;
    };
  }, [page, appliedSearch, ownershipFilter, sortBy]);

  function onApplySearch(e) {
    e.preventDefault();
    setErr("");
    setPage(1);
    setAppliedSearch(search.trim());
  }

  function onChangeView(e) {
    setOwnershipFilter(e.target.value);
    setPage(1);
    setErr("");
  }

  function onChangeSort(e) {
    setSortBy(e.target.value);
    setPage(1);
    setErr("");
  }

  function resetControls() {
    setSearch("");
    setAppliedSearch("");
    setOwnershipFilter("all");
    setSortBy("newest");
    setPage(1);
    setErr("");
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

        <form className="topics-toolbar" onSubmit={onApplySearch}>
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
              onChange={onChangeView}
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
              onChange={onChangeSort}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>

          <div className="topics-toolbar-group topics-toolbar-submit">
            <label>&nbsp;</label>
            <div className="topics-toolbar-actions">
              <button type="submit" className="btn primary">
                Apply
              </button>

              {(search ||
                appliedSearch ||
                ownershipFilter !== "all" ||
                sortBy !== "newest") && (
                <button type="button" className="btn" onClick={resetControls}>
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="topics-toolbar-footer">
          <p className="small">
            Showing page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} total topic{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        {topics.length === 0 ? (
          <div className="empty-state-block">
            <p className="empty-state">No topics match your current filters.</p>
            <p className="small">
              Try clearing the search, switching the view, or changing the sort.
            </p>
          </div>
        ) : (
          <div className="stack" style={{ marginTop: 16 }}>
            {topics.map((t) => {
              const preview = String(t.body || "");
              const shortPreview =
                preview.length > 180 ? `${preview.slice(0, 180)}...` : preview;

              return (
                <article key={t.id} className="card topic-card">
                  <div className="topic-card-header">
                    <div>
                      <h2 className="topic-card-title">{t.title}</h2>
                      <p className="topic-meta">
                        by <strong>{t.author_username}</strong>
                      </p>
                    </div>

                    <div className="topic-stat-badge">
                      {Number(t.reply_count || 0)} repl
                      {Number(t.reply_count || 0) === 1 ? "y" : "ies"}
                    </div>
                  </div>

                  <div className="topic-card-stats">
                    <span className="topic-stat-chip">
                      Created: {formatDateTime(t.created_at)}
                    </span>
                    <span className="topic-stat-chip">
                      Last Updated: {formatDateTime(t.last_activity_at)}
                    </span>
                  </div>

                  {shortPreview ? (
                    <div className="topic-preview">{shortPreview}</div>
                  ) : null}

                  <div className="form-actions">
                    <Link className="btn" to={`/topics/${t.id}`}>
                      Open Topic
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="pagination-bar">
          <button
            type="button"
            className="btn"
            disabled={!pagination.hasPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </button>

          <div className="pagination-status">
            Page <strong>{pagination.page}</strong> of{" "}
            <strong>{pagination.totalPages}</strong>
          </div>

          <button
            type="button"
            className="btn"
            disabled={!pagination.hasNext}
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
          >
            Next →
          </button>
        </div>
      </section>
    </main>
  );
}