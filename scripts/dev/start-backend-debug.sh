#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

node scripts/dev/check-env.mjs

BACKEND_MEMORY_MB="${NODE_MAX_OLD_SPACE_SIZE_BACKEND:-3072}"
BACKEND_DEBUG_PORT="${BACKEND_DEBUG_PORT:-9229}"
export NODE_OPTIONS="--inspect=${BACKEND_DEBUG_PORT} --max-old-space-size=${BACKEND_MEMORY_MB} ${NODE_OPTIONS:-}"

pnpm nx serve api
