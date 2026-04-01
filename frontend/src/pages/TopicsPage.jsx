import { Link } from "react-router-dom";

export default function TopicsPage() {
  return (
    <div>
      <h1>Topics</h1>
      <p>M3: list topics from API.</p>
      <div style={{ marginTop: 12 }}>
        <Link to="/topics/1">Go to Topic #1</Link>
      </div>
    </div>
  );
}