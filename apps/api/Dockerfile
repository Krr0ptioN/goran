FROM node:22-bookworm-slim

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-lock.yaml nx.json tsconfig.base.json .npmrc ./
RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api
COPY libs ./libs
COPY scripts ./scripts
COPY migrations.json jest.config.ts jest.preset.js vitest.workspace.ts eslint.config.js ./

RUN chown -R node:node /workspace

USER node

ENV NODE_OPTIONS=--max-old-space-size=3072

EXPOSE 3000
EXPOSE 9229

CMD ["pnpm", "nx", "serve", "api"]
