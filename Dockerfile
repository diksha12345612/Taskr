FROM node:24-alpine

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

# Remove dev dependencies for production
RUN npm prune --omit=dev

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Setup environment and start
CMD ["npm", "start"]
