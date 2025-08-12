# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Setup nginx and copy build files
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf


ENV VITE_API_URL=http://uniformly-selected-mollusk.ngrok-free.app/api/core

COPY --from=build /app/dist /usr/share/nginx/html

