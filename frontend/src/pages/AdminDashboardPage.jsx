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
          },
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
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="status info">Checking session...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="status error">You must be logged in.</p>
          <div className="form-actions">
            <Link className="btn primary" to="/login">
              Go to Login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (user.role !== "admin") {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="status error">Admin only.</p>
          <div className="form-actions">
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
        <div className="row page-head">
          <div style={{ flex: 1, minWidth: "240px" }}>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">
              Overview of moderation and user activity.
            </p>
          </div>

          <div className="row">
            <Link className="btn" to="/admin/users">
              View Users
            </Link>
            <Link className="btn" to="/admin/deleted-topics">
              View Deleted Topics
            </Link>
            <Link className="btn" to="/topics">
              Back to Topics
            </Link>
          </div>
        </div>

        {err ? <p className="status error">{err}</p> : null}

        <div className="admin-dashboard-grid">
          <article className="admin-stat-card">
            <p className="admin-stat-label">Current Users</p>
            <p className="admin-stat-value">{summary.users}</p>
          </article>

          <article className="admin-stat-card">
            <p className="admin-stat-label">Active Topics</p>
            <p className="admin-stat-value">{summary.activeTopics}</p>
          </article>

          <article className="admin-stat-card">
            <p className="admin-stat-label">Deleted Topics</p>
            <p className="admin-stat-value">{summary.deletedTopics}</p>
          </article>

          <article className="admin-stat-card">
            <p className="admin-stat-label">Deleted Replies</p>
            <p className="admin-stat-value">{summary.deletedReplies}</p>
          </article>
        </div>

        <div className="admin-dashboard-links">
          <Link className="card admin-shortcut" to="/admin/users">
            <h2 className="admin-shortcut-title">Manage Users</h2>
            <p className="small">See all current users and their roles.</p>
          </Link>

          <Link className="card admin-shortcut" to="/admin/deleted-topics">
            <h2 className="admin-shortcut-title">Deleted Topics</h2>
            <p className="small">
              Review soft-deleted topics and restore them.
            </p>
          </Link>

          <Link className="card admin-shortcut" to="/admin/deleted-replies">
            <h2 className="admin-shortcut-title">Deleted Replies</h2>
            <p className="small">
              Review soft-deleted replies and restore them.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
