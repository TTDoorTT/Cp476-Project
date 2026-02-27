# Backend (Node + Express)

## Purpose
This folder contains the Node.js + Express backend skeleton for Milestone 2:
- Health check endpoint
- DB connectivity test endpoint
- MySQL connection via environment variables

## Requirements
- Node.js (v18+ recommended)
- npm
- Docker (for local MySQL)

## Install
From repo root:
-cd backend
-npm install

## run Dev
-cd backend
-npm run dev

Backend runs at:
http://localhost:3000

## Endpoints
GET /health
Expected: {"status":"ok"}

GET /db-test
Expected: {"db":"ok","result":{"ok":1}}

## Local Database (Docker)
From repo root:
- docker compose up -d
Load schema:
- docker exec -i cp476_mysql mysql -ucp476 -pcp476pass cp476_forum < sql/schema.sql
Verify tables:
- docker exec -it cp476_mysql mysql -ucp476 -pcp476pass -e "SHOW TABLES;" cp476_forum

## Environment Variables
Create a local env file (DO NOT COMMIT, please delete after use / testing):
- cp .env.example .env
- .env.example:
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=cp476
DB_PASSWORD=cp476pass
DB_NAME=cp476_forum
