FROM node:22-bookworm-slim

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-lock.yaml nx.json tsconfig.base.json .npmrc ./
RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web
COPY libs ./libs
COPY scripts ./scripts
COPY components.json jest.config.ts jest.preset.js vitest.workspace.ts eslint.config.js ./

RUN chown -R node:node /workspace

USER node

ENV NODE_OPTIONS=--max-old-space-size=4096

EXPOSE 3001
EXPOSE 9230

CMD ["pnpm", "nx", "dev", "web", "--port", "3001", "--hostname", "0.0.0.0"]
