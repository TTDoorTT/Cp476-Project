import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div>
        <h1>Login</h1>
        <p>You are already logged in as <b>{user.username}</b>.</p>
        <button onClick={() => navigate("/topics")}>Go to Topics</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>Login</h1>
      <p>M3: session-based login (cookies).</p>

      {err && <p style={{ color: "#b00020" }}>{err}</p>}

      <form onSubmit={onSubmit}>
        <label>Username or Email</label>
        <input
          style={{ width: "100%", padding: 8, marginTop: 6, marginBottom: 12 }}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          style={{ width: "100%", padding: 8, marginTop: 6, marginBottom: 12 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: 12, fontSize: 12 }}>
        Tip: use the user you registered (e.g. <code>lucas1 / password123</code>)
      </p>
    </div>
  );
}