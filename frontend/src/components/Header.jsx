import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ padding: 12, borderBottom: "1px solid #ddd", marginBottom: 16 }}>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/topics">Topics</Link>
        <Link to="/topics/new">Create Topic</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}