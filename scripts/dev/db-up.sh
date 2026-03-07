#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

docker compose -f docker-compose.dev.yml up -d postgres minio mailpit

echo "Database and development services are up."
echo "- Postgres: localhost:${DB_PORT:-5432}"
echo "- MinIO API: localhost:${FILES_MINIO_PORT:-9000}"
echo "- MinIO Console: localhost:9001"
echo "- Mailpit UI: localhost:8025"
echo "- Optional pgAdmin: run pnpm dev:db:debug"
