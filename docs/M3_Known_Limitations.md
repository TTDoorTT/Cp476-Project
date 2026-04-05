# M3 Known Limitations / Notes

Project: CP476 Forum  
Milestone: 3  
Date: 2026-04-05

## Overview
This document summarizes the main limitations and tradeoffs that remain in the Milestone 3 version of the project. The application is functionally complete for the course scope, but several areas are still optimized for local development and demonstration rather than production deployment.

## Current Limitations

### 1. Testing is mostly manual
The repository currently documents manual testing, but it does not include an automated unit, integration, or end-to-end test suite in the frontend or backend package scripts.

Impact:
- Regression risk is higher when changing routes, UI flows, or authorization logic.
- Team members must re-test core flows manually after major changes.

Possible future improvement:
- Add backend API tests.
- Add frontend component or end-to-end tests.
- Add a repeatable CI test workflow.

### 2. Frontend API base URL is hardcoded for local development
The frontend API layer currently points directly to `http://localhost:3000`.

Impact:
- The project works well in the local demo environment, but deployment to another host would require code changes unless the API base is moved to environment-based configuration.

Possible future improvement:
- Move the frontend API base URL into a Vite environment variable.
- Support separate development and production API targets.

### 3. Admin role assignment is still a manual database task
Normal users can register through the application, but admin promotion is still handled outside the app by updating the database role field.

Impact:
- This is acceptable for milestone demonstration and testing.
- It is not a complete production-ready user administration workflow.

Possible future improvement:
- Add a protected admin-only role management workflow.
- Add safeguards and audit logging around role changes.

### 4. Pagination is not applied consistently across all data views
The public topic list supports pagination, but several other endpoints currently use fixed result caps instead of full paging.

Examples:
- `/topics` supports page and limit parameters.
- `/me/topics` returns up to 200 rows.
- `/me/replies` returns up to 300 rows.
- `/admin/users` returns up to 500 rows.
- Deleted-content admin endpoints also use fixed limits.

Impact:
- This is fine for a course-scale dataset.
- Larger datasets would need full pagination on all list views.

Possible future improvement:
- Add page, limit, and total count metadata to My Content and all admin list endpoints.

### 5. Search and filtering are intentionally limited
Topic listing currently supports a keyword search and basic sort/scope options, but the search is limited to topic title and author username.

Impact:
- Users cannot search topic body text or reply text.
- Admin views and My Content views also have more limited discovery tools than the public topic list.

Possible future improvement:
- Add body search.
- Add reply-content search.
- Add richer filters such as date range or role-based filters for admin.

### 6. Soft delete is implemented for topics and replies, but user-management workflows remain limited
The schema includes `deleted_at` fields, and soft delete/restore flows are implemented for topics and replies. However, the admin side currently focuses on viewing users rather than managing full user lifecycle actions.

Impact:
- The main forum content recovery workflow exists.
- Broader user administration remains minimal.

Possible future improvement:
- Add soft delete / restore / disable actions for users.
- Add clearer moderation and audit workflows.

### 7. The application is designed for plain-text discussion content
The current forum focuses on plain-text posts and replies. Rich-text formatting, attachments, image uploads, and embedded media are not part of the current scope.

Impact:
- This keeps the implementation simpler and reduces security risk.
- The user experience is more basic than a production discussion platform.

Possible future improvement:
- Add carefully sanitized formatting support.
- Add attachment handling.
- Add content moderation rules for uploaded assets.

### 8. Local development setup is stronger than deployment setup
The repository provides a clear local setup using Docker for MySQL plus local frontend/backend servers. However, deployment-specific concerns are not fully addressed in the repo.

Examples:
- No production deployment configuration is included.
- No reverse proxy setup is included.
- No HTTPS, secret rotation, or production monitoring workflow is documented.

Impact:
- The project is appropriate for milestone demonstration.
- Additional work would be needed before real public deployment.

Possible future improvement:
- Add environment-specific configuration.
- Add production deployment documentation.
- Add monitoring, logging, and secure secret management.

## Final Note
These limitations do not prevent the Milestone 3 system from meeting its educational goals. The project demonstrates a complete full-stack workflow with authentication, forum CRUD, ownership/admin authorization, soft delete behavior, restore actions, and a working React frontend over a Node/Express/MySQL backend. The remaining items are mainly production-hardening, scalability, and maintenance improvements.
