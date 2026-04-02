# Demo Script (Milestone 3)

**Length:** ~7 minutes

## 0:00–0:30 Intro

- Project goal: Online discussion forum with users, topics, replies.
- Tech stack: React frontend, Node/Express backend, MySQL (Docker), session auth.

## 0:30–1:30 Run + Architecture

- Show repo structure (`/frontend`, `/backend`, `/sql`).
- Show backend routes: auth, topics, replies.
- Show DB tables briefly and the `deleted_at` soft-delete approach.

## 1:30–2:30 Authentication Flow

- Open `/login` and log in.
- Show header changes with username + role.
- Optional: refresh page to show session persists (`/auth/me`).

## 2:30–4:30 Topics Flow (CRUD)

- Go to `/topics`.
- Create a topic (`/topics/new`) → redirect to detail.
- Edit topic (owner/admin) → save → show updated.
- Delete topic → redirect to list → topic disappears.

## 4:30–6:00 Replies Flow (CRUD)

- Open a topic detail.
- Post a reply → appears.
- Edit reply → update persists.
- Delete reply → removed from list.

## 6:00–6:30 Authorization (Owner/Admin)

- Mention backend enforcement: Unauthorized → 401, Non-owner → 403.
- Optional: admin bypass demo (if enabled).

## 6:30–7:00 Close

- Point to testing report and known limitations docs.
- State next steps (polish, extra validation, etc.).
