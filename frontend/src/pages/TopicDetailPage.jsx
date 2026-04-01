import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function TopicDetailPage() {
  const { id } = useParams();
  const topicId = Number(id);

  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyBody, setReplyBody] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  async function loadAll() {
    setErr("");
    setInfo("");
    try {
      const t = await api.getTopic(topicId);
      setTopic(t.topic);
      const r = await api.listReplies(topicId);
      setReplies(r.replies || []);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    if (!Number.isInteger(topicId) || topicId <= 0) {
      setErr("Invalid topic id");
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  async function onSubmitReply(e) {
    e.preventDefault();
    setErr("");
    setInfo("");

    const text = replyBody.trim();
    if (!text) {
      setErr("Reply cannot be empty");
      return;
    }

    try {
      await api.createReply(topicId, text);
      setReplyBody("");
      setInfo("Reply posted.");
      await loadAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  if (err && !topic) return <div><h1>Topic Detail</h1><p style={{ color: "#b00020" }}>{err}</p></div>;
  if (!topic) return <div><h1>Topic Detail</h1><p>Loading...</p></div>;

  return (
    <div>
      <h1>{topic.title}</h1>
      <p><small>by {topic.author_username}</small></p>
      <p>{topic.body}</p>

      <h2>Replies</h2>
      {err && <p style={{ color: "#b00020" }}>{err}</p>}
      {info && <p style={{ color: "green" }}>{info}</p>}

      {replies.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        <ul>
          {replies.map((r) => (
            <li key={r.id}>
              <b>{r.author_username}</b>: {r.body}
            </li>
          ))}
        </ul>
      )}

      <h3>Post a Reply</h3>
      <form onSubmit={onSubmitReply}>
        <textarea
          rows={4}
          style={{ width: "100%" }}
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
        />
        <button type="submit">Submit Reply</button>
      </form>

      <p style={{ marginTop: 12 }}>
        Note: Posting a reply requires being logged in (session auth).
      </p>
    </div>
  );
}