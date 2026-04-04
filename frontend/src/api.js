const API_BASE = "http://localhost:3000";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
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
  register: (username, email, password) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  login: (identifier, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),

  me: () => apiFetch("/auth/me", { method: "GET" }),

  logout: () => apiFetch("/auth/logout", { method: "POST" }),

  // Topics
  listTopics: ({ page = 1, limit = 10, q = "", sort = "newest", scope = "all" } = {}) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sort", sort);
    params.set("scope", scope);

    if (q.trim()) {
      params.set("q", q.trim());
    }

    return apiFetch(`/topics?${params.toString()}`, { method: "GET" });
  },

  getTopic: (id) => apiFetch(`/topics/${id}`, { method: "GET" }),

  createTopic: (title, body) =>
    apiFetch("/topics", {
      method: "POST",
      body: JSON.stringify({ title, body }),
    }),

  updateTopic: (id, title, body) =>
    apiFetch(`/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, body }),
    }),

  deleteTopic: (id) => apiFetch(`/topics/${id}`, { method: "DELETE" }),

  // Replies
  listReplies: (topicId) =>
    apiFetch(`/topics/${topicId}/replies`, { method: "GET" }),

  createReply: (topicId, body) =>
    apiFetch(`/topics/${topicId}/replies`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  updateReply: (id, body) =>
    apiFetch(`/replies/${id}`, {
      method: "PUT",
      body: JSON.stringify({ body }),
    }),

  deleteReply: (id) => apiFetch(`/replies/${id}`, { method: "DELETE" }),

  // Admin
  listAdminSummary: () => apiFetch("/admin/summary", { method: "GET" }),
  listDeletedTopics: () => apiFetch("/admin/deleted-topics", { method: "GET" }),
  restoreTopicAdmin: (id) =>
    apiFetch(`/admin/topics/${id}/restore`, {
      method: "POST",
    }),
  listDeletedReplies: () =>
    apiFetch("/admin/deleted-replies", { method: "GET" }),
  restoreReplyAdmin: (id) =>
    apiFetch(`/admin/replies/${id}/restore`, {
      method: "POST",
    }),
  listUsersAdmin: () => apiFetch("/admin/users", { method: "GET" }),
};