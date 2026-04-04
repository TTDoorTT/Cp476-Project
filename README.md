# Cp476-Project
## Online Discussion Board / Forum

## Project Overview

This project is a full-stack online discussion board built for **CP476A – Internet Computing**.

Users can register, log in, create discussion topics, post replies, and manage their own content. The application demonstrates a complete client-server workflow using a relational database, session-based authentication, CRUD for core resources, ownership/admin authorization, soft delete behavior, and basic security practices such as server-side validation and parameterized SQL.

---

## Team Members

- Yu SiCheng
- Tojo Tobin
- Qi Wit

---

## Implemented Features

### Authentication and Sessions
- User registration
- User login with **username or email**
- User logout
- Session-based authentication using `express-session`
- `GET /auth/me` to read the currently authenticated user
- User roles via `users.role` with values:
  - `user`
  - `admin`

### Topics
- View all topics
- Topic list pagination
- Search topics by title or author
- Filter topic list to **All Topics** or **My Topics**
- Sort topics by:
  - newest
  - oldest
  - title A–Z
  - title Z–A
- Topic metadata shown in list:
  - author
  - reply count
  - created time
  - last activity time
- View topic detail
- Create topic
- Edit topic (owner or admin)
- Delete topic (owner or admin)
- Topic deletion is implemented as **soft delete** using `deleted_at`

### Replies
- View replies for a topic
- Post replies to a topic
- Edit reply (owner or admin)
- Delete reply (owner or admin)
- Reply deletion is implemented as **soft delete** using `deleted_at`

### My Content
- Logged-in users can view their own posted content
- Separate backend endpoints for:
  - `GET /me/topics`
  - `GET /me/replies`

### Admin Features
- View all current users
- View soft-deleted topics
- Restore soft-deleted topics
- View soft-deleted replies
- Restore soft-deleted replies

### Security and Validation
- Server-side input validation for auth, topics, and replies
- Ownership/admin authorization checks
- Parameterized SQL queries through `mysql2`
- React rendering of user content as plain text
- Session-protected routes for authenticated actions
- Admin-only routes for admin functionality

---

## Tech Stack

### Frontend
- React
- React Router
- Vite

### Backend
- Node.js
- Express
- express-session
- bcrypt
- mysql2
- CORS
- cookie-parser
- dotenv

### Database
- MySQL 8
- Docker / Docker Compose

---

## Repository Structure

```text
Cp476-Project/
├─ backend/              # Express API server
├─ frontend/             # React + Vite frontend
├─ frontend_m2_static/   # Archived Milestone 2 static frontend
├─ sql/                  # Schema and migrations
├─ docs/                 # Project documents / diagrams / artifacts
├─ docker-compose.yml    # MySQL container setup
└─ README.md
```

---

## Data Model Summary

### users
- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password_hash`
- `role` (`user` or `admin`)
- `created_at`
- `deleted_at`

### topics
- `id` (PK)
- `user_id` (FK → users.id)
- `title`
- `body`
- `created_at`
- `updated_at`
- `deleted_at`

### replies
- `id` (PK)
- `topic_id` (FK → topics.id)
- `user_id` (FK → users.id)
- `body`
- `created_at`
- `updated_at`
- `deleted_at`

---

## Local Setup

## 1. Start the database

From the repository root:

```bash
docker compose up -d
```

This starts a MySQL 8 container named `cp476_mysql`.

---

## 2. Load the schema

From the repository root:

```bash
docker exec -i cp476_mysql mysql -ucp476 -pcp476pass cp476_forum < sql/schema.sql
```

Apply the role migration:

```bash
docker exec -i cp476_mysql mysql -ucp476 -pcp476pass cp476_forum < sql/migrations/001_add_role_to_users.sql
```

Optional verification:

```bash
docker exec -it cp476_mysql mysql -ucp476 -pcp476pass -e "SHOW TABLES;" cp476_forum
```

---

## 3. Start the backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend default URL:

```text
http://localhost:3000
```

Quick checks:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/db-test
```

---

## 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

---

## Environment Variables

The backend `.env.example` includes:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=cp476
DB_PASSWORD=cp476pass
DB_NAME=cp476_forum
SESSION_SECRET=dev_secret_change_later
FRONTEND_ORIGIN=http://localhost:5173
```

---

## Core API Endpoints

### Health / Test
- `GET /health`
- `GET /db-test`
- `GET /session-test`
- `GET /protected-test`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Topics
- `GET /topics`
- `GET /topics/:id`
- `POST /topics`
- `PUT /topics/:id`
- `DELETE /topics/:id`

### Replies
- `GET /topics/:topicId/replies`
- `POST /topics/:topicId/replies`
- `PUT /replies/:id`
- `DELETE /replies/:id`

### My Content
- `GET /me/topics`
- `GET /me/replies`

### Admin
- `GET /admin/deleted-topics`
- `POST /admin/topics/:id/restore`
- `GET /admin/deleted-replies`
- `POST /admin/replies/:id/restore`
- `GET /admin/users`

---

## Frontend Pages

- `/login`
- `/register`
- `/topics`
- `/topics/:id`
- `/topics/new`
- `/my-content`
- `/admin/deleted-topics`
- `/admin/deleted-replies`
- `/admin/users`

---

## Demo / Testing Notes

### Create a normal user

```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user1@test.com","password":"password123"}'
```

### Create an admin user

First register a user, then update the role in MySQL:

```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","email":"admin1@test.com","password":"password123"}'

docker exec -it cp476_mysql mysql -ucp476 -pcp476pass cp476_forum -e \
"UPDATE users SET role='admin' WHERE username='admin1'; SELECT id, username, role FROM users;"
```

---

## Notes

- Topics and replies use **soft delete** via `deleted_at`.
- The topic list supports pagination, filtering, search, and sorting.
- Auth is cookie/session based, so frontend requests must send credentials.
- The archived `frontend_m2_static` folder is kept as milestone evidence and styling reference.

---

## Course Context

This repository was developed as a CP476 course project to demonstrate:
- full-stack web application structure
- client/server interaction
- relational database design
- authentication and authorization
- CRUD functionality
- software project organization using GitHub

