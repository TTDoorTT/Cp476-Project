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
- **Admin User (if enabled):** Promote via DB

```sql
UPDATE users SET role='admin' WHERE username='lucas1';
```

## Manual Test Cases

**Legend:** Mark Pass/Fail and add notes.

## Authentication

| ID | Test | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|
| AUTH-01 | Login success | React: `/login` → enter valid creds | Header shows logged-in user + role | [ ] Pass  [ ] Fail | |
| AUTH-02 | Login fail | `/login` with wrong password | Error shown; no session | [ ] Pass  [ ] Fail | |
| AUTH-03 | Session persists | Refresh page after login | Still logged in (`/auth/me`) | [ ] Pass  [ ] Fail | |
| AUTH-04 | Logout | Click logout | Logged out; `/auth/me` returns 401 | [ ] Pass  [ ] Fail | |

## Topics (CRUD + soft delete)

| ID | Test | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|
| TOP-01 | List topics | React: `/topics` | Topics load from backend | [ ] Pass  [ ] Fail | |
| TOP-02 | Create topic (auth required) | Logged in → `/topics/new` submit | Redirect to `/topics/:id` | [ ] Pass  [ ] Fail | |
| TOP-03 | Create topic blocked | Logged out → `/topics/new` | UI blocks / backend 401 | [ ] Pass  [ ] Fail | |
| TOP-04 | View topic detail | Open `/topics/:id` | Title/body/author visible | [ ] Pass  [ ] Fail | |
| TOP-05 | Edit topic (owner/admin) | Edit topic → save | Updated content persists | [ ] Pass  [ ] Fail | |
| TOP-06 | Delete topic (soft delete) | Delete topic | Redirect; topic hidden | [ ] Pass  [ ] Fail | |
| TOP-07 | Deleted topic not accessible | Open deleted topic URL | 404 / not found | [ ] Pass  [ ] Fail | |

## Replies (CRUD + soft delete)

| ID | Test | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|
| REP-01 | List replies | Open topic detail | Replies list loads | [ ] Pass  [ ] Fail | |
| REP-02 | Create reply (auth required) | Logged in → post reply | Reply appears in list | [ ] Pass  [ ] Fail | |
| REP-03 | Create reply blocked | Logged out → post reply | Backend 401; UI shows error | [ ] Pass  [ ] Fail | |
| REP-04 | Edit reply (owner/admin) | Edit reply → save | Updated reply persists | [ ] Pass  [ ] Fail | |
| REP-05 | Delete reply (soft delete) | Delete reply | Reply removed from list | [ ] Pass  [ ] Fail | |

## Authorization (Owner/Admin rules)

| ID | Test | Steps | Expected | Result | Notes |
|---|---|---|---|---|---|
| AUTHZ-01 | Owner can manage own topic | Login as owner | Edit/Delete works | [ ] Pass  [ ] Fail | |
| AUTHZ-02 | Owner can manage own reply | Login as owner | Edit/Delete works | [ ] Pass  [ ] Fail | |
| AUTHZ-03 | Non-owner blocked | Login as different user (optional) | Backend 403 on edit/delete | [ ] Pass  [ ] Fail | |
| AUTHZ-04 | Admin bypass (if enabled) | Promote to admin | Admin can manage others’ content | [ ] Pass  [ ] Fail | |

## Summary

- **Total Cases:** ____
- **Pass:** ____
- **Fail:** ____

## Notes

- Soft delete implemented via `deleted_at`; list/detail endpoints filter `deleted_at IS NULL`.
- Backend enforces authorization; React hides edit/delete buttons as best-effort UX.
