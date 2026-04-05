import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState({
    users: 0,
    activeTopics: 0,
    deletedTopics: 0,
    deletedReplies: 0,
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    let alive = true;

    api
      .listAdminSummary()
      .then((data) => {
        if (!alive) return;
        setSummary(
          data.summary || {
            users: 0,
            activeTopics: 0,
            deletedTopics: 0,
            deletedReplies: 0,
          }
        );
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e.message || "Failed to load admin summary");
      });

    return () => {
      alive = false;
    };
  }, [user]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <article className="card stack">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="empty-state">Checking session...</p>
          </article>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="page-section">
        <div className="container">
          <article className="card stack">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="empty-state">You must be logged in.</p>
            <div className="topic-actions">
              <Link className="btn" to="/login">
                Go to Login
              </Link>
            </div>
          </article>
        </div>
      </section>
    );
  }

  if (user.role !== "admin") {
    return (
      <section className="page-section">
        <div className="container">
          <article className="card stack">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="empty-state">Admin only.</p>
            <div className="topic-actions">
              <Link className="btn" to="/">
                Back to Topics
              </Link>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container stack">
        <article className="card stack">
          <div className="row page-head">
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">
                Overview of moderation and user activity.
              </p>
            </div>
          </div>

          {err ? <div className="status error">{err}</div> : null}

          <div className="admin-summary-grid">
            <article className="admin-summary-card">
              <p className="admin-summary-label">Current Users</p>
              <p className="admin-summary-value">{summary.users}</p>
            </article>

            <article className="admin-summary-card">
              <p className="admin-summary-label">Active Topics</p>
              <p className="admin-summary-value">{summary.activeTopics}</p>
            </article>

            <article className="admin-summary-card">
              <p className="admin-summary-label">Deleted Topics</p>
              <p className="admin-summary-value">{summary.deletedTopics}</p>
            </article>

            <article className="admin-summary-card">
              <p className="admin-summary-label">Deleted Replies</p>
              <p className="admin-summary-value">{summary.deletedReplies}</p>
            </article>
          </div>
        </article>

        <div className="admin-grid">
          <article className="card admin-item stack">
            <div className="admin-item-top">
              <div>
                <h2 className="admin-item-title">Manage Users</h2>
                <p className="admin-meta">
                  See all current users and their roles.
                </p>
              </div>
              <Link className="btn" to="/admin/users">
                Open Users
              </Link>
            </div>
          </article>

          <article className="card admin-item stack">
            <div className="admin-item-top">
              <div>
                <h2 className="admin-item-title">Deleted Topics</h2>
                <p className="admin-meta">
                  Review soft-deleted topics and restore them.
                </p>
              </div>
              <Link className="btn" to="/admin/deleted-topics">
                Open Deleted Topics
              </Link>
            </div>
          </article>

          <article className="card admin-item stack">
            <div className="admin-item-top">
              <div>
                <h2 className="admin-item-title">Deleted Replies</h2>
                <p className="admin-meta">
                  Review soft-deleted replies and restore them.
                </p>
              </div>
              <Link className="btn" to="/admin/deleted-replies">
                Open Deleted Replies
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}