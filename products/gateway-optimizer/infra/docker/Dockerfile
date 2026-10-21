FROM node:24.19.0-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY apps ./apps
COPY packages ./packages
COPY adapters ./adapters
COPY scripts ./scripts
RUN npm run build && npm prune --omit=dev
FROM node:24.19.0-bookworm-slim
WORKDIR /app
ENV HOST=0.0.0.0 PORT=4173 DATA_DIR=/app/data GATEWAY_MODE=demo
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/apps ./apps
COPY package.json ./
RUN mkdir -p /app/data && chown node:node /app/data
USER node
EXPOSE 4173
CMD ["node","dist/apps/core-api/main.js"]
