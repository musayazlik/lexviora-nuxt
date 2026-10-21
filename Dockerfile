# Build stage
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm@12.11.2 && pnpm install --frozen-lockfile

COPY . .
ENV NUXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# Runtime stage — Nuxt's .output is self-contained
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NUXT_TELEMETRY_DISABLED=1

COPY --from=build /app/.output ./.output
COPY --from=build /app/server/database/migrations ./migrations

RUN mkdir -p /app/.data/media && chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
