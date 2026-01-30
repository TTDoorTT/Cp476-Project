# Cp476-Project
# Online Discussion Board / Forum

## Project Overview
This project is a simplified online discussion board designed as a full-stack web application for CP476A – Internet Computing.  
The application allows users to create discussion topics, post replies, and manage their own content while demonstrating a complete user workflow, relational database design, and basic security practices.

The project emphasizes planning, clear requirements, teamwork, and accountability in addition to technical implementation.

---

## Team Members
- Yu SiCheng
- Tojo Tobin
- Qi Wit

---

## Core Features

### Must Have (MVP)
- User registration, login, and logout
- View list of discussion topics
- Create new discussion topics
- View topic threads with replies
- Post replies to topics
- Edit or delete own topics and replies
- Server-side input validation
- Authorization checks (ownership-based permissions)

### Should Have
- User roles (User / Moderator / Admin)
- Moderator ability to delete posts or lock topics
- Pagination for topic lists

### Could Have
- Tags or categories for topics
- Simple keyword search
- Upvotes or likes

---

## User Workflow
1. User registers or logs in
2. User views a list of discussion topics
3. User creates a new topic or selects an existing one
4. User posts replies within a topic
5. User edits or deletes their own content
6. Moderator/admin may manage posts or lock topics

This workflow supports full CRUD functionality and demonstrates a complete end-to-end application flow.

---

## Tech Stack (Planned)
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** (e.g., Node.js + Express OR PHP)
- **Database:** MySQL (relational database)
- **Version Control:** GitHub
- **Project Management:** GitHub Projects (Kanban)

*(Exact technologies may be finalized during development.)*

---

## Data Model (High-Level)

### Users
- user_id (PK)
- username
- email
- password_hash
- role
- created_at

### Topics
- topic_id (PK)
- user_id (FK → Users)
- title
- body
- is_locked
- created_at
- updated_at

### Posts (Replies)
- post_id (PK)
- topic_id (FK → Topics)
- user_id (FK → Users)
- body
- created_at
- updated_at
- is_deleted

---

## Security & Validation
- Server-side validation for required fields and length limits
- Password hashing (no plain-text storage)
- Authorization checks for edit/delete actions
- Parameterized queries / ORM to prevent SQL injection
- Output escaping or sanitization to reduce XSS risk

---
## Project Management
- GitHub Issues are used to track tasks
- GitHub Projects (Kanban) board columns:
  - Backlog
  - Ready
  - In Progress
  - In Review
  - Done
- Tasks are assigned to team members and moved across columns as work progresses


