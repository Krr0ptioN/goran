#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

node scripts/dev/check-env.mjs

BACKEND_MEMORY_MB="${NODE_MAX_OLD_SPACE_SIZE_BACKEND:-3072}"
export NODE_OPTIONS="--max-old-space-size=${BACKEND_MEMORY_MB} ${NODE_OPTIONS:-}"

pnpm nx serve api
