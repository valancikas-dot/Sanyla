# Use Node.js 20 Alpine - No Prisma, using pg directly
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.27.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY .npmrc ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build web app
RUN pnpm --filter @marketing-autopilot/web build

# Production stage
FROM node:20-alpine AS production

RUN npm install -g pnpm@10.27.0

WORKDIR /app

# Copy built files and dependencies
COPY --from=base /app ./

# Expose port
EXPOSE 3000

# Start web app
CMD ["pnpm", "--filter", "@marketing-autopilot/web", "start"]
