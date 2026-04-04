import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    let alive = true;

    api
      .listUsersAdmin()
      .then((data) => {
        if (!alive) return;
        setUsers(data.users || []);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e.message || "Failed to load users");
      });

    return () => {
      alive = false;
    };
  }, [user]);

  if (loading) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Checking session...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container page-section">
        <section className="card">
          <h1 className="page-title">Users</h1>
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
          <h1 className="page-title">Users</h1>
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
            <h1 className="page-title">Users</h1>
            <p className="page-subtitle">
              Admin view of all current users.
            </p>
          </div>

          <div className="row">
            <Link className="btn" to="/admin/deleted-topics">
              View Deleted Topics
            </Link>
            <Link className="btn" to="/topics">
              Back to Topics
            </Link>
          </div>
        </div>

        {err ? <p className="status error">{err}</p> : null}

        {users.length === 0 ? (
          <p className="empty-state">No users found.</p>
        ) : (
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>
                      <span
                        className={
                          item.role === "admin"
                            ? "role-badge role-admin"
                            : "role-badge role-user"
                        }
                      >
                        {item.role}
                      </span>
                    </td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}