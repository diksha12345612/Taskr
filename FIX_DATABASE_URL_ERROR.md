# Fix: "Environment variable not found: DATABASE_URL"

## Problem

When deploying to Railway or Docker, you get:

```
error: Environment variable not found: DATABASE_URL.
  -->  prisma/schema.prisma:11
```

## Root Cause

The `.env` file is in `.gitignore` (not committed to git), so the deployment container doesn't have it. Prisma can't find `DATABASE_URL` because:
1. `.env` file is missing in the container
2. `DATABASE_URL` environment variable is not set in deployment platform

## Solution ✅

### For Railway Deployment (RECOMMENDED)

1. **Go to Railway Dashboard**
   - Select your project
   - Go to "Variables" tab

2. **Add Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=file:./dev.db
   JWT_SECRET=TaskrSuperSecretKey2026_VerySecureKey123eKey123
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-railway-domain.up.railway.app
   API_PREFIX=/api
   ```

3. **Redeploy**
   - Push a new commit or click "Redeploy" in Railway dashboard
   - Watch logs to confirm success

### For Docker Local Testing

```bash
# Option 1: Set environment variable before running
export DATABASE_URL="file:./dev.db"
npm start

# Option 2: Use Docker Compose
docker-compose up

# Option 3: Pass via .env file (automatic now)
npm start  # setup-env.js creates it automatically
```

### What Changed in the Code

We added `setup-env.js` that:
- Runs before every database setup
- Creates `.env` file with environment variables
- Uses defaults if variables aren't set
- Ensures DATABASE_URL is always available

**Updated Script Flow:**
```
npm start
  → npm run db:setup
    → npm run setup-env        ← NEW: Creates .env file
      → cd backend && npx prisma generate
      → npx prisma db push
    → cd backend && npm start
```

## Testing Locally

```bash
# Test that setup works
node setup-env.js

# Check if .env was created
cat backend/.env

# Should show:
# DATABASE_URL=file:./dev.db
# NODE_ENV=production
# etc...
```

## Environment Variables Reference

| Platform | How to Set | Example |
|----------|-----------|---------|
| **Local Dev** | `.env` file (auto-created) | `file:./dev.db` |
| **Railway** | Dashboard Variables tab | `DATABASE_URL=file:./dev.db` |
| **Docker** | `-e DATABASE_URL=...` | `file:./dev.db` |
| **Dockerfile** | `ENV DATABASE_URL=...` | `file:./dev.db` |
| **Docker Compose** | `.env` or `environment:` | `file:./dev.db` |

## Deployment Checklist

- [ ] Set `DATABASE_URL` in deployment platform (Railway Variables)
- [ ] Set `NODE_ENV=production`
- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Update `CORS_ORIGIN` to your frontend URL
- [ ] Push changes to GitHub
- [ ] Check deployment logs in Railway

## Still Getting Error?

1. **Check Railway Logs**
   - Go to project → Logs tab
   - Look for DATABASE_URL value

2. **Verify Variables Set**
   ```bash
   # In Railway terminal (if available)
   echo $DATABASE_URL
   echo $NODE_ENV
   ```

3. **Check setup-env.js ran**
   - Should see "✅ Environment setup complete" in logs
   - Should see DATABASE_URL value printed

4. **Force redeploy**
   - Push a new commit: `git push origin main`
   - Or click Redeploy button in Railway

## Quick Restart

After setting environment variables:

```bash
# Local
npm start

# Railway: Push to trigger redeploy
git add .
git commit -m "Deploy"
git push origin main
```

---

**Files Updated:**
- ✅ `setup-env.js` - Auto-setup script
- ✅ `backend/.env.example` - Correct configuration
- ✅ `package.json` - Runs setup-env before db operations
- ✅ `DEPLOYMENT_GUIDE.md` - Full deployment instructions
- ✅ `Dockerfile` - Container configuration
