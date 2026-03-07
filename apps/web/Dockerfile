FROM node:22-bookworm-slim

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-lock.yaml nx.json tsconfig.base.json .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_OPTIONS=--max-old-space-size=4096

EXPOSE 3001
EXPOSE 9230

CMD ["pnpm", "nx", "dev", "web", "--port", "3001", "--hostname", "0.0.0.0"]
