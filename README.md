# Cp476-Project
# Online Discussion Board / Forum

## Project Overview
This project is a simplified online discussion board designed as a full-stack web application for **CP476A – Internet Computing**.  
Users can register/login, create discussion topics, post replies, and manage their own content. The application demonstrates an end-to-end workflow against a relational database, CRUD for core objects, and basic security practices (validation + authorization + parameterized SQL).

---

## Team Members
- Yu SiCheng
- Tojo Tobin
- Qi Wit

---

## Core Features (Implemented)

### Authentication & Users
- User registration
- User login/logout (**session cookie auth**)
- `GET /auth/me` to read current session user
- User roles via `users.role` = `user | admin`

### Topics (CRUD)
- List topics
- View topic detail
- Create topic (auth required)
- Edit topic (**owner/admin**)
- Delete topic (**owner/admin**, **soft delete** via `deleted_at`)

### Replies (CRUD)
- List replies for a topic
- Post reply (auth required)
- Edit reply (**owner/admin**)
- Delete reply (**owner/admin**, **soft delete** via `deleted_at`)

### Security & Validation
- Server-side input validation (required fields, basic length checks)
- Authorization enforcement (401 unauthenticated, 403 forbidden)
- Parameterized SQL queries (prevents SQL injection)
- React renders user content as plain text (no `dangerouslySetInnerHTML`)

---

## Tech Stack (Final)
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** MySQL 8 (Docker)
- **Auth:** Express sessions (cookie-based)
- **Project Management:** GitHub Issues + GitHub Projects (Kanban)

---

## Repo Structure
- `/frontend` — React frontend (Vite)
- `/frontend_m2_static` — archived Milestone 2 static HTML UI (kept for evidence/reference)
- `/backend` — Express API server
- `/sql` — schema and migrations
- `/docs` — milestone artifacts (diagrams, reports, etc.)

---

## Data Model (High-Level)

### Users
- id (PK)
- username (UNIQUE, NOT NULL)
- email (UNIQUE, NOT NULL)
- password_hash (NOT NULL)
- role (ENUM('user','admin') NOT NULL default 'user')
- created_at (default current timestamp)
- deleted_at (nullable)

### Topics
- id (PK)
- user_id (FK → users.id)
- title
- body
- created_at
- updated_at
- deleted_at (soft delete)

### Replies
- id (PK)
- topic_id (FK → topics.id)
- user_id (FK → users.id)
- body
- created_at
- updated_at
- deleted_at (soft delete)

---

## Running Locally (Clean Machine Steps)

### 1) Database (Docker)
From the repo root:
```bash
docker compose up -d
```

Load schema into MySQL:
```bash
docker exec -i cp476_mysql mysql -ucp476 -pcp476pass cp476_forum < sql/schema.sql
```

Verify tables:
```bash
docker exec -it cp476_mysql mysql -ucp476 -pcp476pass -e "SHOW TABLES;" cp476_forum
```

Expected tables: `users`, `topics`, `replies`

> Note: A migration was added during M3:
> - `sql/migrations/001_add_role_to_users.sql`

---

### 2) Backend (Node + Express)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Health check:
```bash
curl http://localhost:3000/health
```

DB test:
```bash
curl http://localhost:3000/db-test
```

---

### 3) Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Open:
- http://localhost:5173

---

## API Endpoints (Core)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Topics
- `GET /topics`
- `GET /topics/:id`
- `POST /topics` (auth required)
- `PUT /topics/:id` (owner/admin)
- `DELETE /topics/:id` (owner/admin, soft delete)

### Replies
- `GET /topics/:topicId/replies`
- `POST /topics/:topicId/replies` (auth required)
- `PUT /replies/:id` (owner/admin)
- `DELETE /replies/:id` (owner/admin, soft delete)

---

## User/Admin Setup (for Demo/Testing)
To promote a user to admin:
```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","email":"admin1@test.com","password":"password123"}'

docker exec -it cp476_mysql mysql -ucp476 -pcp476pass cp476_forum -e \
"UPDATE users SET role='admin' WHERE username='admin1'; SELECT id, username, role FROM users;"
```

To add a normal user:
```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user2","email":"user2@test.com","password":"password123"}'
```

---

## Project Management
- GitHub Issues track tasks
- GitHub Projects (Kanban) columns:
  - Backlog
  - Ready
  - In Progress
  - In Review
  - Done

---

## Notes
- Soft delete is implemented via `deleted_at`. List/detail endpoints filter `deleted_at IS NULL`.
- Frontend conditionally renders edit/delete controls for owner/admin; backend is the source of truth.
