import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const pw = password;
    const cpw = confirmPassword;

    if (!cleanUsername || !cleanEmail || !pw || !cpw) {
      setErr("username, email, password, and confirm password are required");
      return;
    }

    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      setErr("username must be 3-50 characters");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setErr("email must be valid");
      return;
    }

    if (pw.length < 6) {
      setErr("password must be at least 6 characters");
      return;
    }

    if (pw !== cpw) {
      setErr("passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await api.register(cleanUsername, cleanEmail, pw);
      await login(cleanEmail, pw);
      navigate("/topics");
    } catch (e2) {
      setErr(e2.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (user) {
    return (
      <main className="container page-section auth-layout">
        <section className="card">
          <h1 className="page-title">Register</h1>
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
        <h1 className="page-title">Register</h1>
        <p className="page-subtitle">Create a new forum account.</p>

        {err ? <p className="status error">{err}</p> : null}

        <form onSubmit={onSubmit} className="form-grid" style={{ marginTop: 16 }}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
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
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? "Creating Account..." : "Register"}
            </button>

            <Link className="btn" to="/login">
              Go to Login
            </Link>

            <Link className="btn" to="/topics">
              Back to Topics
            </Link>
          </div>
        </form>

        <p className="auth-note">
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </section>
    </main>
  );
}