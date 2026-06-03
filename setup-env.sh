#!/bin/bash
# Environment Setup Script for Deployment
# This script ensures DATABASE_URL is available during deployment

set -e

echo "🔧 Setting up environment variables..."

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
  echo "📝 Creating backend/.env file..."
  cat > backend/.env << EOF
NODE_ENV=${NODE_ENV:-production}
PORT=${PORT:-5000}
DATABASE_URL=${DATABASE_URL:-file:./dev.db}
JWT_SECRET=${JWT_SECRET:-TaskrSuperSecretKey2026_VerySecureKey123eKey123}
JWT_EXPIRE=${JWT_EXPIRE:-7d}
CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:5173}
API_PREFIX=${API_PREFIX:-/api}
EOF
  echo "✅ Environment file created"
else
  echo "✅ Environment file already exists"
fi

# Verify DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set in environment, using default: file:./dev.db"
  export DATABASE_URL="file:./dev.db"
fi

echo "✅ Environment setup complete"
echo "DATABASE_URL: $DATABASE_URL"
