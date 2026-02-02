# Dockerfile for Skill Engine sandbox
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
# Install any additional runtime dependencies here (e.g., ffmpeg, python)

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
CMD ["node", "src/app.js"]
