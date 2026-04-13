# Flowboard

A Kanban-style project management app — think a lightweight Trello or Linear. Flowboard lets you organise work into projects, boards, columns, and tickets, with priority levels and assignees per ticket.

> This project was built as a learning exercise to get hands-on with Svelte and SvelteKit.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | [SvelteKit 5](https://kit.svelte.dev) + TypeScript |
| Backend | [Express 5](https://expressjs.com) + TypeScript |
| Database | [PostgreSQL 16](https://www.postgresql.org) (via Docker) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Auth | GitHub OAuth |
| Monorepo | npm workspaces |

---

## Project structure

```
flowboard/
├── apps/
│   ├── web/          # SvelteKit frontend
│   └── api/          # Express backend
├── docker-compose.yml
└── package.json
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 1. Install dependencies

```bash
npm install
```

### 2. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL instance on port `5435` with:

- **User:** `flowboard`
- **Password:** `flowboard`
- **Database:** `flowboard`

### 3. Push the schema and seed test data

```bash
cd apps/web
npm run db:push    # creates all tables
npm run db:seed    # loads test users, projects, boards, and tickets
```

### 4. Start the dev servers

From the root:

```bash
npm run dev
```

This runs both the SvelteKit frontend and the Express API concurrently.

| Server | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |

---

## Database commands

All commands run from `apps/web/`.

```bash
npm run db:push       # push schema changes directly to the DB (dev)
npm run db:generate   # generate a SQL migration file
npm run db:migrate    # apply pending migration files
npm run db:seed       # insert test data
npm run db:studio     # open Drizzle Studio (visual DB browser)
```
