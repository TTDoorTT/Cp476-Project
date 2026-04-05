# M3 Testing Report

Project: CP476 Forum  
Milestone: 3  

## 1. Purpose
This report summarizes manual testing performed for the Milestone 3 discussion forum application. The goal of testing was to verify that the major user flows, admin flows, authorization rules, soft-delete behavior, restore behavior, validation, and basic security checks work correctly across the React frontend, Express backend, and MySQL database.

## 2. Test Environment
- Frontend: React + Vite (`http://localhost:5173`)
- Backend: Node.js + Express (`http://localhost:3000`)
- Database: MySQL 8 in Docker (`cp476_mysql`, port `3306`)
- Authentication: Session cookie (`connect.sid`)
- Browser used for manual UI tests: Chrome or equivalent modern browser

## 3. Setup Used for Testing
### Start database
```bash
docker compose up -d
```

### Load schema
```bash
docker exec -i cp476_mysql mysql -ucp476 -pcp476pass cp476_forum < sql/schema.sql
docker exec -i cp476_mysql mysql -ucp476 -pcp476pass cp476_forum < sql/migrations/001_add_role_to_users.sql
```

### Start backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Start frontend
```bash
cd frontend
npm install
npm run dev
```

## 4. Test Accounts
### Normal user
Create through the app or API:
```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user1@test.com","password":"password123"}'
```

### Admin user
Create a normal user first:
```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","email":"admin1@test.com","password":"password123"}'
```

Then promote the user in MySQL:
```bash
docker exec -it cp476_mysql mysql -ucp476 -pcp476pass cp476_forum -e \
"UPDATE users SET role='admin' WHERE username='admin1'; SELECT id, username, role FROM users;"
```

## 5. Testing Approach
Testing was manual and focused on:
- registration, login, logout, and session behavior
- topic creation, editing, listing, filtering, and pagination
- reply creation and editing
- ownership and admin authorization
- soft delete and restore behavior
- admin-only views and actions
- My Content page behavior
- validation and safe content rendering

## 6. Final Manual Test Results
All cases below were re-verified manually and passed.

### Authentication
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| AUTH-01 | User registration | New user can register successfully | Pass | Register page loaded, submission succeeded, and new account could log in afterward |
| AUTH-02 | Login validation and success flow | Invalid credentials are rejected and valid credentials log the user in | Pass | Authenticated pages became accessible after valid login |
| AUTH-03 | Logout flow | User is logged out and protected pages become inaccessible | Pass | Authenticated UI disappeared after logout |

### Guest / Protected Access
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| SEC-01 | Guest blocked from protected pages/actions | Unauthenticated users cannot access protected pages or perform protected actions | Pass | Create Topic, My Content, and admin pages were blocked correctly |

### Topics
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| TOP-01 | Create topic | Logged-in user can create a topic | Pass | New topic appeared in the topics list and in the user's content area |
| TOP-02 | Edit own topic | Topic owner can edit their own topic and changes persist | Pass | Changes persisted after refresh |
| USR-07 | Topic owner soft-delete | Topic owner can soft-delete their own topic | Pass | Topic disappeared from normal views and appeared in admin deleted-content view |
| SEC-03 | Non-owner cannot delete another user's topic | Non-owner cannot delete someone else's topic | Pass | Delete control was not available and forced deletion was blocked |
| ADM-06 | Admin can manage another user's topic | Admin can edit and soft-delete another user's topic | Pass | Edit persisted and delete removed the topic from normal views |

### Replies
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| REP-01 | Create reply | Logged-in user can post a reply | Pass | Reply appeared in thread and remained after refresh |
| REP-02 | Edit own reply | Reply owner can edit their own reply and changes persist | Pass | Changes persisted after refresh |
| USR-08 | Reply owner soft-delete | Reply owner can soft-delete their own reply | Pass | Reply disappeared from thread and appeared in admin deleted-content view |
| SEC-04 | Non-owner cannot delete another user's reply | Non-owner cannot delete someone else's reply | Pass | Delete control was not available and forced deletion was blocked |
| ADM-07 | Admin can manage another user's reply | Admin can edit and soft-delete another user's reply | Pass | Edit persisted and delete removed the reply from the normal thread |

### Topics Page UI
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| UI-01 | Topic search/filter/reset | Search and filter work correctly and Reset restores full list | Pass | Matching results displayed correctly and empty state worked |
| UI-02 | Topic pagination | Topics page paginates correctly across multiple pages | Pass | Next/previous pagination worked and page contents updated correctly |

### My Content UI
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| UI-03 | My Content tabs and pagination | My Topics / My Replies switch correctly and paginate cleanly | Pass | Only the user's own records were shown and layout stayed stable |

### Validation and Safe Rendering
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| VAL-01 | Invalid topic/reply submission validation | Invalid or empty topic/reply submissions are blocked | Pass | Feedback appeared and no invalid records were created |
| SEC-06 | XSS/script-style input handled safely | Script-like input does not execute in the browser | Pass | Content displayed safely and remained safe after refresh |

### Admin Pages and Admin-Only Features
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| ADM-01 | Admin dashboard summary | Admin dashboard loads and summary cards/counts display correctly | Pass | Non-admin access was correctly restricted |
| ADM-02 | Admin users list | Admin users page loads and displays current users | Pass | Both admin and normal users were visible; non-admin access was blocked |
| ADM-03 | Admin deleted-content view | Admin can view deleted topics/replies | Pass | Deleted items were visible and identifiable; non-admin access was blocked |
| ADM-04 | Restore deleted topic | Admin can restore a soft-deleted topic | Pass | Restored topic reappeared in normal views and disappeared from deleted list |
| ADM-05 | Restore deleted reply | Admin can restore a soft-deleted reply | Pass | Restored reply reappeared in thread and disappeared from deleted list |

### Admin Route Protection
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| SEC-05 | Non-admin cannot invoke admin restore routes directly | Non-admin direct restore attempts are rejected | Pass | Deleted topic/reply remained deleted after direct restore attempts |

### Soft Delete Visibility
| ID | Test | Expected Result | Status | Notes |
|---|---|---|---|---|
| SEC-07 | Soft-deleted content stays hidden from normal access | Deleted topic/reply should not appear in normal views or normal access paths | Pass | Deleted content only appeared in admin deleted-content view |

## 7. Summary
### Recorded pass count
- Total manually re-verified test cases: 21
- Passed: 21
- Failed: 0

### Overall assessment
The project passed the major Milestone 3 functional checks:
- registration, login, logout, and protected-route behavior
- topic and reply creation/editing
- owner-based soft delete behavior
- cross-user authorization restrictions
- admin override and admin-only management features
- admin deleted-content and restore workflows
- topic filtering and pagination
- My Content tab separation and pagination
- form validation and safe rendering of user input

## 8. Notes
- Testing in this repository is primarily manual rather than automated.
- Both UI behavior and route protection were verified through workflow-based testing.
- For final submission, screenshots of admin restore flows, authorization blocking, and pagination behavior would strengthen the report further.
