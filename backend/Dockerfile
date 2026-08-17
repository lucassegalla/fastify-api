FROM node:24-slim AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/index.html ./
COPY frontend/vite.config.js ./
COPY frontend/src ./src
COPY frontend/public ./public

ENV VITE_API_URL=/api

RUN npm run build


FROM node:24-slim AS backend-base

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci


FROM backend-base AS test

COPY backend/app.js backend/server.js ./
COPY backend/config ./config
COPY backend/controllers ./controllers
COPY backend/database ./database
COPY backend/errors ./errors
COPY backend/middlewares ./middlewares
COPY backend/repositories ./repositories
COPY backend/routes ./routes
COPY backend/schemas ./schemas
COPY backend/services ./services
COPY backend/tests ./tests

CMD ["npm", "test"]


FROM node:24-slim AS production

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node backend/app.js backend/server.js ./
COPY --chown=node:node backend/config ./config
COPY --chown=node:node backend/controllers ./controllers
COPY --chown=node:node backend/database ./database
COPY --chown=node:node backend/errors ./errors
COPY --chown=node:node backend/middlewares ./middlewares
COPY --chown=node:node backend/repositories ./repositories
COPY --chown=node:node backend/routes ./routes
COPY --chown=node:node backend/schemas ./schemas
COPY --chown=node:node backend/services ./services

COPY --from=frontend-build --chown=node:node /frontend/dist ./public

USER node

EXPOSE 3000

CMD ["npm", "start"]