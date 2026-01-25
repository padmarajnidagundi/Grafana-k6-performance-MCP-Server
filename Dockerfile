# Use Node.js LTS as base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

# Install k6
RUN apk add --no-cache ca-certificates && \
    apk add --no-cache --virtual .build-deps curl && \
    curl -L https://github.com/grafana/k6/releases/download/v0.49.0/k6-v0.49.0-linux-amd64.tar.gz | tar xvz --strip-components=1 -C /usr/local/bin && \
    apk del .build-deps

# Create app directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create directories for tests and results
RUN mkdir -p /app/k6-tests /app/k6-results

# Set environment variables
ENV NODE_ENV=production
ENV K6_TESTS_DIR=/app/k6-tests
ENV K6_RESULTS_DIR=/app/k6-results

# Expose port (if needed for health checks)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('healthy')" || exit 1

# Run the MCP server
CMD ["node", "build/index.js"]
