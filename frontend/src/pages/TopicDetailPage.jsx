import { useParams } from "react-router-dom";

export default function TopicDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Topic Detail</h1>
      <p>Topic ID: {id}</p>
      <p>M3: show topic + replies from API.</p>
    </div>
  );
}