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
    <header style={{ padding: 12, borderBottom: "1px solid #ddd", marginBottom: 16 }}>
      <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/topics">Topics</Link>
        <Link to="/topics/new">Create Topic</Link>

        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          {loading ? (
            <span>Checking session…</span>
          ) : user ? (
            <>
              <span>
                Logged in as <b>{user.username}</b> ({user.role})
              </span>
              <button onClick={onLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}