# WaterSafe Hub – Hackathon-Ready MVP

A React + Vite frontend with a simple Express + Prisma backend using PostgreSQL. UI remains unchanged; codebase simplified for demo clarity.

## What’s Inside
- Frontend: Vite + React + Tailwind + shadcn/ui
- Backend: Express (TypeScript) + Prisma ORM
- DB: PostgreSQL
- Seed data for quick demo

## Quick Start (Windows PowerShell)

1) Install dependencies
```powershell
# frontend deps
npm install
# backend deps
npm --prefix server install
```

2) Configure environment
```powershell
# copy env examples
Copy-Item .env.example .env -Force
Copy-Item server/.env.example server/.env -Force
```

3) Start PostgreSQL
- Use Docker Desktop or local Postgres. Easiest is Docker:
```powershell
# run once
docker run --name watersafe-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```
- Ensure `server/.env` has a matching `DATABASE_URL`.

4) Initialize database
```powershell
# create schema + generate client
npm --prefix server run prisma:migrate
# optional subsequent runs
npm --prefix server run prisma:generate
# seed demo data
npm --prefix server run prisma:seed
```

5) Run the app (frontend + backend together)
```powershell
npm run dev:all
```
- Frontend runs at http://localhost:8080
- Backend runs at http://localhost:5174 (health: /api/health)

If you prefer separate terminals:
```powershell
npm run dev          # frontend
npm run dev:server   # backend
```

## Environment Variables
- Frontend: `VITE_API_BASE` (default `http://localhost:5174/api`)
- Backend: `DATABASE_URL`, `PORT`

## Project Structure
```
server/
	prisma/
		schema.prisma    # Prisma schema (User, Report)
		seed.ts          # Seed data
	src/
		index.ts         # Express app
		lib/prisma.ts    # Prisma client singleton
		routes/
			reports.ts     # CRUD routes for reports
			users.ts       # Minimal users API
src/
	pages/             # UI pages (unchanged visually)
	components/        # UI components
	lib/api.ts         # Tiny API client for frontend
```

## Data Model (Prisma)
- User: optional name/email; 1-to-many Reports
- Report: location, coordinates, description, status (PENDING/INVESTIGATING/RESOLVED), priority (LOW/MEDIUM/HIGH/CRITICAL), timestamps

## How It Works
- PublicAccountability page loads reports via `GET /api/reports` and renders exactly the same UI.
- CitizenReport submits new reports via `POST /api/reports` with basic validation.
- UploadData remains a front-end mock for now (can be wired later to a file-upload endpoint).

## Common Commands
```powershell
# run both
npm run dev:all
# run migrations
npm --prefix server run prisma:migrate
# generate Prisma Client
npm --prefix server run prisma:generate
# seed demo data
npm --prefix server run prisma:seed
```

## Notes
- Keep the UI identical; backend swaps in for mock data.
- Code is commented and minimal for easy explanation.
- For production, use a managed Postgres and set `DATABASE_URL` accordingly.
# Welcome to your Lovable project

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
