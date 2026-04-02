const API_BASE = "http://localhost:3000";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = data && data.message ? data.message : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Auth
  login: (identifier, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password })
    }),
  me: () => apiFetch("/auth/me", { method: "GET" }),
  logout: () => apiFetch("/auth/logout", { method: "POST" }),

  // Topics
  listTopics: () => apiFetch("/topics", { method: "GET" }),
  getTopic: (id) => apiFetch(`/topics/${id}`, { method: "GET" }),
  createTopic: (title, body) =>
    apiFetch("/topics", {
      method: "POST",
      body: JSON.stringify({ title, body })
    }),
  updateTopic: (id, title, body) =>
    apiFetch(`/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, body })
    }),
  deleteTopic: (id) => apiFetch(`/topics/${id}`, { method: "DELETE" }),

  // Replies
  listReplies: (topicId) => apiFetch(`/topics/${topicId}/replies`, { method: "GET" }),
  createReply: (topicId, body) =>
    apiFetch(`/topics/${topicId}/replies`, {
      method: "POST",
      body: JSON.stringify({ body })
    }),
  updateReply: (replyId, body) =>
    apiFetch(`/replies/${replyId}`, {
      method: "PUT",
      body: JSON.stringify({ body })
    }),
  deleteReply: (replyId) => apiFetch(`/replies/${replyId}`, { method: "DELETE" })
};