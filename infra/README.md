# Infrastructure

Use the root development compose file for local infrastructure:

```bash
pnpm dev:db:up
```

This brings up:

- Postgres
- MinIO
- Mailpit

Optional debug profile for pgAdmin:

```bash
docker compose -f docker-compose.dev.yml --profile debug up -d pgadmin
```
