# 🚀 Deployment Guide - Taskr Application

## Docker Deployment (Local & Cloud)

### Prerequisites
- Docker installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

### Option 1: Docker Compose (Easiest)

```bash
# Start application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop application
docker-compose down
```

Access at: **http://localhost:5000**

### Option 2: Manual Docker Build

```bash
# Build image
docker build -t taskr:latest .

# Run container
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:./dev.db \
  taskr:latest

# Or with volume for persistent database
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:./dev.db \
  -v $(pwd)/backend/dev.db:/app/backend/dev.db \
  taskr:latest
```

### Docker Environment Variables

```env
NODE_ENV=production          # Always use production
DATABASE_URL=file:./dev.db   # SQLite path in container
JWT_SECRET=<your-secret>     # Keep same as local
JWT_EXPIRE=7d                # Token expiration
CORS_ORIGIN=http://localhost:5000  # For local Docker
API_PREFIX=/api              # API prefix
```

---

## Railway Deployment (Recommended)

### Prerequisites
- GitHub repository connected to Railway
- Railway account at [https://railway.app](https://railway.app)

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your repository

### Step 2: Configure Environment Variables

In the Railway dashboard, set these environment variables:

```env
NODE_ENV=production
DATABASE_URL=file:./dev.db
JWT_SECRET=TaskrSuperSecretKey2026_VerySecureKey123eKey123
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-railway-domain.up.railway.app
API_PREFIX=/api
```

**⚠️ CRITICAL:** Make sure `DATABASE_URL` is set! This prevents the "Environment variable not found" error.

### Step 3: Set Build Command

In Railway settings:
- **Build Command:** `npm install && npm run db:setup`
- **Start Command:** `npm start`

### Step 4: Deploy

Railway automatically deploys when you push to main branch.

### Troubleshooting Deployment

#### Error: "vite: not found" in Docker build

**Solution:** 
The Dockerfile now installs all dependencies (including dev) before building the frontend, then prunes dev dependencies. This issue is fixed. Rebuild with:
```bash
docker build --no-cache -t taskr:latest .
```

#### Error: "Environment variable not found: DATABASE_URL"

**Solution:** 
1. Go to Railway project settings
2. Add `DATABASE_URL=file:./dev.db` to environment variables
3. Redeploy

#### Error: "Port already in use"

**Solution:** Railway sets PORT automatically. Remove any hardcoded port settings.

#### Error: "Cannot find module"

**Solution:**
1. Check that `postinstall` script runs: `npm run install:backend && npm run install:frontend && npm run build:frontend`
2. Verify all dependencies are in package.json

### Data Persistence with SQLite

SQLite files are stored in the container's `/app` directory. Data persists until the container is stopped. For permanent storage:

**Option 1: Use PostgreSQL on Railway**
```
DATABASE_URL=postgresql://user:password@host:port/database
```

**Option 2: Use Volume Storage (Premium)**
Configure persistent volumes in Railway settings.

---

## Local Development

### Quick Start

```bash
# Install all dependencies
npm run install-all

# Start backend and frontend
npm run dev
```

Access at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api

### Database Commands

```bash
# Push schema to SQLite
cd backend && npx prisma db push

# Open Prisma Studio
cd backend && npx prisma studio

# Reset database (warning: deletes all data)
cd backend && npx prisma db reset
```

---

## Environment Variables Reference

| Variable | Local | Production | Required |
|----------|-------|-----------|----------|
| `NODE_ENV` | development | production | ✅ |
| `PORT` | 5000 | auto (Railway) | ✅ |
| `DATABASE_URL` | `file:./dev.db` | Set in platform | ✅ |
| `JWT_SECRET` | Default key | Strong key (32+ chars) | ✅ |
| `JWT_EXPIRE` | 7d | 7d | ✅ |
| `CORS_ORIGIN` | http://localhost:5173 | Your frontend URL | ✅ |
| `API_PREFIX` | /api | /api | ✅ |

---

## Security Checklist for Production

- [ ] Change `JWT_SECRET` to a random 32+ character string
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to your production frontend URL
- [ ] Use PostgreSQL or persistent storage for SQLite
- [ ] Enable HTTPS (Railway does this automatically)
- [ ] Review all API endpoints for authentication
- [ ] Set strong database credentials
- [ ] Monitor application logs in Railway dashboard

---

## Database Migration Scripts

### For PostgreSQL Deployment

If switching from SQLite to PostgreSQL:

```bash
# 1. Update Prisma schema provider to postgresql
# In prisma/schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 2. Push schema
npx prisma db push --accept-data-loss

# 3. Seed database (optional)
npx prisma db seed
```

---

### Docker Health Check

The `docker-compose.yml` includes a health check that verifies the application is running:

```bash
# Check container health
docker-compose ps

# View health status
docker inspect <container-id> | grep -A 5 "Health"
```

### Persistent Database in Docker

SQLite database is stored in a volume to persist data between container restarts:

```bash
# Create named volume (recommended for production)
docker volume create taskr-db

# Use in docker-compose.yml:
volumes:
  - taskr-db:/app/backend/dev.db
```

---

## Monitoring & Logs

### Docker Logs
```bash
# View logs
docker-compose logs -f app

# View specific number of lines
docker-compose logs --tail=50 app
```

### Railway Logs
1. Go to your Railway project
2. Click "Logs" tab
3. View real-time application output

### Debugging Issues

Enable verbose logging in `src/config/database.js`:

```javascript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## Rollback & Redeploy

### Rollback to Previous Deploy

1. Go to Railway project
2. Click "Deployments" tab
3. Select previous version
4. Click "Redeploy"

### Manual Redeploy

Push a new commit to trigger automatic redeploy:

```bash
git add .
git commit -m "Trigger redeploy"
git push origin main
```

---

## Questions or Issues?

- Check Railway logs for error messages
- Review this guide's troubleshooting section
- Check the main README.md for more information
