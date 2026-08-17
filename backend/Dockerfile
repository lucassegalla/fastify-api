FROM node:24-slim AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci


FROM base AS test

COPY app.js server.js ./

COPY config ./config
COPY controllers ./controllers
COPY database ./database
COPY errors ./errors
COPY middlewares ./middlewares
COPY repositories ./repositories
COPY routes ./routes
COPY schemas ./schemas
COPY services ./services
COPY tests ./tests

CMD ["npm", "test"]


FROM node:24-slim AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node app.js server.js ./

COPY --chown=node:node config ./config
COPY --chown=node:node controllers ./controllers
COPY --chown=node:node database ./database
COPY --chown=node:node errors ./errors
COPY --chown=node:node middlewares ./middlewares
COPY --chown=node:node repositories ./repositories
COPY --chown=node:node routes ./routes
COPY --chown=node:node schemas ./schemas
COPY --chown=node:node services ./services

USER node

EXPOSE 3000

CMD ["npm", "start"]