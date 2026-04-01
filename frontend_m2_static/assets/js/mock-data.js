window.MOCK_TOPICS = [
  {
    id: 1,
    title: "Welcome to the forum",
    author: "admin",
    created_at: "2026-02-01",
    body: "This is a sample topic used for Milestone 2 UI shells."
  },
  {
    id: 2,
    title: "Milestone 2 planning",
    author: "team",
    created_at: "2026-02-06",
    body: "Track progress in the Wiki and keep issues moving on the Kanban board."
  }
];

window.MOCK_REPLIES = {
  1: [
    { id: 101, author: "lucas", created_at: "2026-02-02", body: "Looks good." },
    { id: 102, author: "admin", created_at: "2026-02-03", body: "Remember to update meeting logs." }
  ],
  2: [
    { id: 201, author: "team", created_at: "2026-02-07", body: "DB schema and backend skeleton are next." }
  ]
};