import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="site-header">
      <div className="container header-row">
        <div className="brand">
          <Link to="/topics">CP476 Forum</Link>
        </div>

        <nav className="nav">
          <Link to="/topics">Topics</Link>
          {user ? <Link to="/topics/new">Create Topic</Link> : null}

          {user?.role === "admin" ? (
            <>
              <Link to="/admin">Admin</Link>
              <Link to="/admin/deleted-topics">Deleted Topics</Link>
              <Link to="/admin/users">Users</Link>
            </>
          ) : null}

          {loading ? (
            <span className="nav-status">Checking session…</span>
          ) : user ? (
            <>
              <span className="nav-status">
                Logged in as {user.username} ({user.role})
              </span>
              <button type="button" className="btn primary" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
