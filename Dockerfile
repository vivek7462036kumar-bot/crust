# Multi-stage Dockerfile for Crust & Ember Next.js Observability App
# ------------------------------------------------------------------------------
# Stage 1: Build & Package
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install native dependencies required by Prisma engine on Alpine Linux
RUN apk add --no-cache openssl libc6-compat

# Install dependencies using package lock
COPY package.json package-lock.json ./
RUN npm ci

# Copy database schema and pre-seeded SQLite database
COPY prisma ./prisma

# Generate Prisma Client including linux-musl-openssl-3.0.x engine
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate

# Copy source and config files
COPY tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs ./
COPY .eslintrc.json ./
COPY src ./src
COPY public ./public

# Build optimized Next.js production distribution
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Runtime Production Container
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:./dev.db"

# Install runtime libraries and wget for container healthcheck
RUN apk add --no-cache openssl libc6-compat wget

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy artifacts from builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Ensure database directory permissions for SQLite read/write
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=15s \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

# Start Next.js production server
CMD ["npx", "next", "start", "-p", "3000"]

