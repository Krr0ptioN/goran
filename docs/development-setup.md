# Development Setup

This project has separate scripts for database, backend, and frontend workflows,
including debug modes and memory-optimized defaults.

## Prerequisites

- Node.js 22+
- pnpm 10+
- Docker and Docker Compose

## 1) Bootstrap the environment

```bash
pnpm dev:setup
```

What this does:

- copies `.env.example` to `.env` if missing
- installs dependencies

## 2) Start local development services (DB, object storage, mail)

```bash
pnpm dev:db:up
```

Available services:

- Postgres: `localhost:5432`
- MinIO API: `localhost:9000`
- MinIO Console: `http://localhost:9001`
- Mailpit SMTP/UI: `localhost:1025`, `http://localhost:8025`

Stop services:

```bash
pnpm dev:db:down
```

Start pgAdmin (debug profile):

```bash
pnpm dev:db:debug
```

Stream service logs:

```bash
pnpm dev:db:logs
```

## 3) Run backend and frontend separately

Backend:

```bash
pnpm dev:backend
```

Frontend:

```bash
pnpm dev:frontend
```

The backend and frontend have independent scripts so each can be restarted/debugged
without interrupting the other.

## 4) Debug modes

Backend debug (Node inspector):

```bash
pnpm dev:backend:debug
```

- Inspector default: `localhost:9229`

Frontend debug (Node inspector for Next process):

```bash
pnpm dev:frontend:debug
```

- Inspector default: `localhost:9230`

## 5) Memory tuning

Defaults are already baked into scripts:

- backend: `3072 MB`
- frontend: `4096 MB`

Override at runtime:

```bash
NODE_MAX_OLD_SPACE_SIZE_BACKEND=4096 pnpm dev:backend
NODE_MAX_OLD_SPACE_SIZE_FRONTEND=6144 pnpm dev:frontend
```

Memory-optimized builds:

```bash
pnpm build:api:mem
pnpm build:web:mem
```

## 6) Database migration utility

```bash
pnpm db:migrate
```

## 7) Optional Dockerfiles for app containers

- `apps/api/Dockerfile`
- `apps/web/Dockerfile`

Build examples:

```bash
docker build -f apps/api/Dockerfile -t goran-api-dev .
docker build -f apps/web/Dockerfile -t goran-web-dev .
```
