FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY taskr-app/package*.json ./taskr-app/

# Install dependencies
RUN npm install --omit=dev

# Copy application code
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Setup environment and start
CMD ["npm", "start"]
