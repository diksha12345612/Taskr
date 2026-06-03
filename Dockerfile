FROM node:24-alpine

# Install system dependencies for Prisma and OpenSSL
RUN apk add --no-cache \
    openssl \
    ca-certificates \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY taskr-app/package*.json ./taskr-app/

# Install all dependencies (including dev dependencies needed for build)
RUN npm install

# Copy application code
COPY . .

# Build frontend
RUN npm run build:frontend

# Generate Prisma Client only (skip db push during build)
RUN cd backend && npx prisma generate

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Keep dependencies for runtime (prisma db push needs them)
# Setup environment and start
CMD ["npm", "start"]
