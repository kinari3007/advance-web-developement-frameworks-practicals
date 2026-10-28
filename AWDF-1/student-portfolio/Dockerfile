# ── Dockerfile (root) — Practical 11 ─────────────────────────────────────────
#
# Multi-stage build for the React + Vite frontend.
#
# Stage 1 (builder): installs dependencies, runs "vite build", produces dist/
# Stage 2 (runtime): copies dist/ into a lightweight Nginx image to serve it
#
# Why Nginx instead of "vite preview"?
#   - vite preview is a development convenience, not a production server.
#   - nginx:alpine is ~25 MB, starts instantly, and handles static files
#     efficiently without a Node.js runtime in the final image.
#
# The frontend container serves on port 80 inside the container.
# docker-compose.yml maps that to port 5173 on the host so the URL
# http://localhost:5173 continues to work as before.

# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Cache node_modules layer separately from application source
COPY package.json package-lock.json ./
RUN npm ci

# Copy all frontend source files
# .dockerignore excludes node_modules, dist, .env, .git
COPY . .

# Produce the production build in /app/dist
RUN npm run build

# ── Stage 2: serve ────────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS runtime

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration (defined below, included via COPY)
# This file handles client-side routing (React Router) by falling back to
# index.html for unknown paths.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80 inside the container
EXPOSE 80

# nginx:stable-alpine already sets the correct CMD, so no CMD override needed.
