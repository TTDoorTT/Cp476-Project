import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const id = identifier.trim();
    const pw = password;

    if (!id || !pw) {
      setErr("identifier and password are required");
      return;
    }

    try {
      await login(id, pw);
      navigate("/topics");
    } catch (e2) {
      setErr(e2.message || "Login failed");
    }
  }

  if (user) {
    return (
      <main className="container page-section auth-layout">
        <section className="card">
          <h1 className="page-title">Login</h1>
          <p className="page-subtitle">
            You are already logged in as {user.username}.
          </p>

          <div className="form-actions">
            <Link className="btn primary" to="/topics">
              Go to Topics
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container page-section auth-layout">
      <section className="card">
        <h1 className="page-title">Login</h1>
        <p className="page-subtitle">
          Sign in with your username or email.
        </p>

        {err ? <p className="status error">{err}</p> : null}

        <form onSubmit={onSubmit} className="form-grid" style={{ marginTop: 16 }}>
          <div>
            <label htmlFor="identifier">Username or Email</label>
            <input
              id="identifier"
              className="input"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              Login
            </button>
            <Link className="btn" to="/topics">
              Back to Topics
            </Link>
          </div>
        </form>

        <p className="auth-note">
          Register UI is not wired here yet. Login is fully connected to the backend.
        </p>
      </section>
    </main>
  );
}
