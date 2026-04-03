# Testing Report (Milestone 3)

**Project:** CP476 Forum  
**Date:** __________  
**Tested By:** __________  

## Environment

- **Backend:** Node.js + Express (port 3000)
- **Frontend:** React (Vite) (port 5173)
- **DB:** MySQL 8 (Docker) (port 3306)
- **Auth:** Session cookies (`connect.sid`)

## How to Run (for testing)

### Start DB
```bash
docker compose up -d
```

### Start backend
```bash
cd backend
npm install
npm run dev
```

### Start frontend
```bash
cd frontend
npm install
npm run dev
```

## Test Accounts

- **Normal User:** `lucas1 / password123`
- add a normal user
```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user2","email":"user2@test.com","password":"password123"}'
```

- **Admin User (if enabled):** Promote via DB
- add a normal user
```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","email":"admin1@test.com","password":"password123"}'

docker exec -it cp476_mysql mysql -ucp476 -pcp476pass cp476_forum -e \
"UPDATE users SET role='admin' WHERE username='admin1'; SELECT id, username, role FROM users;"
```



```sql
UPDATE users SET role='admin' WHERE username='lucas1';
```

## Manual Test Cases

**Legend:** Mark Pass/Fail and add notes.

## Authentication

| ID | Test | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|
| AUTH-01 | Login success | React: `/login` → enter valid creds | Header shows logged-in user + role | [x] Pass  [ ] Fail | Header showed `Logged in as lucas1 (user)` |
| AUTH-02 | Login fail | `/login` with wrong password | Error shown; no session | [x] Pass  [ ] Fail | Login failed with `invalid credentials` and user remained logged out |
| AUTH-03 | Session persists | Refresh page after login | Still logged in (`/auth/me`) | [x] Pass  [ ] Fail | After refresh, header still showed `Logged in as lucas1 (user)` |
| AUTH-04 | Logout | Click logout | Logged out; `/auth/me` returns 401 | [x] Pass  [ ] Fail | Redirected to `/login`; header showed `Login` and no logged-in user |

## Topics (CRUD + soft delete)

| ID | Test | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|
| TOP-01 | List topics | React: `/topics` | Topics load from backend | [x] Pass  [ ] Fail | Topics page loaded and header still showed `lucas1 (user)` |
| TOP-02 | Create topic (auth required) | Logged in → `/topics/new` submit | Redirect to `/topics/:id` | [x] Pass  [ ] Fail | Created `M3 Manual Test Topic`; redirected to topic detail page and Edit/Delete buttons were visible |
| TOP-03 | Create topic blocked | Logged out → `/topics/new` | UI blocks / backend 401 | [x] Pass  [ ] Fail | Create Topic page showed `You must be logged in to create a topic.` and provided a Go to Login button |
| TOP-04 | View topic detail | Open `/topics/:id` | Title/body/author visible | [x] Pass  [ ] Fail | Topic detail page loaded and showed title, body, and author |
| TOP-05 | Edit topic (owner/admin) | Edit topic → save | Updated content persists | [x] Pass  [ ] Fail | Topic title and body updated successfully and persisted on the detail page |
| TOP-06 | Delete topic (soft delete) | Delete topic | Redirect; topic hidden | [x] Pass  [ ] Fail | Topic deleted successfully, redirected to topics list, and topic no longer appeared in the list |
| TOP-07 | Deleted topic not accessible | Open deleted topic URL | 404 / not found | [x] Pass  [ ] Fail | Opening deleted topic URL showed `topic not found` on the topic detail page |

## Replies (CRUD + soft delete)

| ID | Test | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|
| REP-01 | List replies | Open topic detail | Replies list loads | [x] Pass  [ ] Fail | Replies section loaded and showed the posted reply |
| REP-02 | Create reply (auth required) | Logged in → post reply | Reply appears in list | [x] Pass  [ ] Fail | Reply appeared under the topic and Edit/Delete buttons were visible for the reply |
| REP-03 | Create reply blocked | Logged out → post reply | Backend 401; UI shows error | [x] Pass  [ ] Fail | Reply was not posted and page showed `not logged in` while user remained logged out |
| REP-04 | Edit reply (owner/admin) | Edit reply → save | Updated reply persists | [x] Pass  [ ] Fail | Reply text updated successfully and stayed visible after saving |
| REP-05 | Delete reply (soft delete) | Delete reply | Reply removed from list | [x] Pass  [ ] Fail | Reply disappeared from the topic page after delete |

## Authorization (Owner/Admin rules)

| ID | Test | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|
| AUTHZ-01 | Owner can manage own topic | Login as owner | Edit/Delete works | [x] Pass  [ ] Fail | Owner was able to edit and delete own topic |
| AUTHZ-02 | Owner can manage own reply | Login as owner | Edit/Delete works | [x] Pass  [ ] Fail | Owner was able to edit and delete own reply |
| AUTHZ-03 | Non-owner blocked | Login as different user (optional) | Backend 403 on edit/delete | [ ] Pass  [ ] Fail | |
| AUTHZ-04 | Admin bypass (if enabled) | Promote to admin | Admin can manage others’ content | [ ] Pass  [ ] Fail | |

## Summary

- **Total Cases:** 18
- **Pass:** 18
- **Fail:** 0

## Notes

- Soft delete implemented via `deleted_at`; list/detail endpoints filter `deleted_at IS NULL`.
- Backend enforces authorization; React hides edit/delete buttons as best-effort UX.
- XSS sanity check: Passed. Posting `<script>alert(1)</script>` did not execute any script. It rendered as plain text in the reply list.
