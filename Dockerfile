# -------- Base image --------
FROM node:18-bullseye-slim AS base
WORKDIR /app
COPY package.json turbo.json ./
COPY apps ./apps
COPY packages ./packages

# -------- Build Stage --------
FROM base AS builder
ENV VITE_API_URL=https://uniformly-selected-mollusk.ngrok-free.app/api/core

RUN npm install
RUN turbo run build

# -------- Nginx Stage --------
FROM nginx:stable AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy build output from builder stage
COPY --from=builder /app/apps/web/dist ./

# Copy custom nginx config (optional)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080


CMD ["nginx", "-g", "daemon off;"]
