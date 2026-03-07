#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f ".env" ]]; then
  cp ".env.example" ".env"
  echo "Created .env from .env.example"
else
  echo ".env already exists"
fi

pnpm install

echo "Development setup complete."
echo "Next steps:"
echo "  1) pnpm dev:db:up"
echo "  2) pnpm dev:backend"
echo "  3) pnpm dev:frontend"
