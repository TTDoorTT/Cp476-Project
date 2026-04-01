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
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const message = (data && data.message) ? data.message : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Topics
  listTopics: () => apiFetch("/topics", { method: "GET" }),
  getTopic: (id) => apiFetch(`/topics/${id}`, { method: "GET" }),

  // Replies
  listReplies: (topicId) => apiFetch(`/topics/${topicId}/replies`, { method: "GET" }),
  createReply: (topicId, body) =>
    apiFetch(`/topics/${topicId}/replies`, {
      method: "POST",
      body: JSON.stringify({ body })
    }),

  createTopic: (title, body) =>
    apiFetch("/topics", {
      method: "POST",
      body: JSON.stringify({ title, body })
    }),


  // Auth (we will wire UI later)
  login: (identifier, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password })
    }),
  me: () => apiFetch("/auth/me", { method: "GET" }),
  logout: () => apiFetch("/auth/logout", { method: "POST" })
};

