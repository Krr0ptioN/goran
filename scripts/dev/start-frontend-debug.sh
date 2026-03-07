#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

node scripts/dev/check-env.mjs

FRONTEND_MEMORY_MB="${NODE_MAX_OLD_SPACE_SIZE_FRONTEND:-4096}"
FRONTEND_DEBUG_PORT="${FRONTEND_DEBUG_PORT:-9230}"
WEB_PORT="${WEB_PORT:-3001}"
export NODE_OPTIONS="--inspect=${FRONTEND_DEBUG_PORT} --max-old-space-size=${FRONTEND_MEMORY_MB} ${NODE_OPTIONS:-}"

pnpm nx dev web --port "${WEB_PORT}"
