Known Limitations / Notes (Milestone 3)

•	UI styling is functional-first; further polish can be added (layout, spacing, typography).
•	Admin creation is enabled via DB update for demo/testing (no public promote endpoint).
•	Soft delete implemented with deleted_at; deleted topics/replies are hidden from list/detail endpoints.
•	Backend uses parameterized queries for DB access.
•	React renders user text as plain text (no raw HTML injection).
•	If a register page is not implemented in React yet, registration can be done via API/curl.
