### Users
- id (PK, INT AUTO_INCREMENT)
- username (VARCHAR, UNIQUE, NOT NULL)
- email (VARCHAR, UNIQUE, NOT NULL)
- password_hash (VARCHAR, NOT NULL)
- created_at (DATETIME, NOT NULL default current)
- deleted_at (DATETIME, NULL)

### Topics
- id (PK)
- user_id (FK → users.id, NOT NULL)
- title (VARCHAR, NOT NULL)
- body (TEXT, NOT NULL)
- created_at (DATETIME, NOT NULL default current)
- updated_at (DATETIME, NULL)
- deleted_at (DATETIME, NULL)

### Posts (Replies)
- id (PK)
- topic_id (FK → topics.id, NOT NULL)
- user_id (FK → users.id, NOT NULL)
- body (TEXT, NOT NULL)
- created_at (DATETIME, NOT NULL default current)
- updated_at (DATETIME, NULL)
- deleted_at (DATETIME, NULL)

### Relationships (cardinality)

- users (1) ── (many) topics
- topics (1) ── (many) replies
- users (1) ── (many) replies

### notes
- topics.user_id is required
- replies.topic_id is required
- M2 delete behavior: topics → replies ON DELETE CASCADE
- Soft delete reserved for M3 via deleted_at