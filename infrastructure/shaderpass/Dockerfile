FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build 

FROM caddy:2.10-alpine

COPY ./infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist/ /srv

