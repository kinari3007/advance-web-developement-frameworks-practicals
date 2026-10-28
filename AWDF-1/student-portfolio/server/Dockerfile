# ── server/Dockerfile — Practical 11 ─────────────────────────────────────────
#
# Builds the Express + Mongoose backend (Practicals 5–10).
# Secrets (MONGO_URI, JWT_SECRET) are injected at runtime via Docker Compose
# environment variables and are never baked into this image.

# Use the current LTS release. Pin the minor to keep builds reproducible.
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests first so Docker can cache the npm install layer.
# The layer is only rebuilt when package.json or package-lock.json change.
COPY package.json package-lock.json ./

# Install production dependencies only.
# --omit=dev keeps the image small; no test or lint tooling is needed at runtime.
RUN npm ci --omit=dev

# Copy the rest of the server source code.
# .dockerignore (at the root level) prevents node_modules and .env from
# being sent to the build context, so they are never included here.
COPY . .

# Expose the port the Express server listens on.
# The actual port binding is declared in docker-compose.yml.
EXPOSE 5000

# Start the Express server.
# "node server.js" matches the existing "start" script in package.json.
CMD ["node", "server.js"]
