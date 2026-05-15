# Taskr - Quick Reference Card

## 🚀 Server Startup (30 seconds)

```bash
# Terminal 1: Backend
cd backend
npm run dev
# → http://localhost:5000/api/health

# Terminal 2: Frontend  
cd taskr-app
npm run dev
# → http://localhost:5173
```

## 📁 Key Folders

```
backend/src/
├── config/       ← Config files
├── middleware/   ← Auth, errors
├── routes/       ← Endpoints (TODO)
├── controllers/  ← Logic (TODO)
└── utils/        ← Helpers

taskr-app/src/
├── components/   ← React components
├── pages/        ← Full pages
├── context/      ← Auth state
└── services/     ← API calls
```

## 🔑 Important Files

| File | Purpose |
|------|---------|
| backend/.env | Database URL & secrets |
| backend/package.json | Dependencies & scripts |
| backend/prisma/schema.prisma | Database schema |
| taskr-app/.env | Frontend API URL |
| SETUP_GUIDE.md | PostgreSQL setup |
| BACKEND_ARCHITECTURE.md | Code patterns |

## 📊 Database

```
User ─┬─ owns ─ Project ─┬─ has ─ Task
      │                  │
      └─ assigned to ──┬─┘
                      │
      ProjectMember ──┘ (junction)
```

## 🔐 Auth Flow

```
1. User fills form (email, password)
2. POST /api/auth/register or /api/auth/login
3. Backend validates & hashes password
4. Returns JWT token
5. Frontend stores token in localStorage
6. Frontend sends token with each API request
7. Backend verifies token on protected routes
```

## 📝 Common Tasks

### Start Development
```bash
npm install          # First time
npm run migrate      # First time (backend)
npm run dev         # Every time
```

### Database Operations
```bash
npm run db:push     # Push schema changes
npm run migrate     # Create migration
npm run db:reset    # Start fresh (DEV ONLY)
npx prisma studio  # Visual browser
```

### Build Routes
```
1. Create src/routes/feature.js
2. Create src/controllers/feature.js
3. Register in src/app.js
4. Follow patterns in BACKEND_ARCHITECTURE.md
```

## 🌐 API Response Format

```json
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { /* your data */ }
}

// Error
{
  "success": false,
  "message": "Error description",
  "error": "Details (dev only)"
}
```

## 🔒 Authentication Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://taskr_user:password@localhost:5432/taskr_db
JWT_SECRET=<32+ chars>
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 💾 Database Schema Summary

### User
- email (unique), password (hashed), role, name

### Project  
- name, description, status, ownerId

### Task
- title, status, priority, dueDate, projectId, assigneeId

### ProjectMember (junction)
- projectId, userId (unique pair)

## 🛠️ Middleware Stack

```
Request
  ↓
Body Parser (JSON)
  ↓
CORS Check
  ↓
Route Handler
  ↓
Authenticate (if protected)
  ↓
Controller Logic
  ↓
Database Query
  ↓
Error Handler (if error)
  ↓
Response
```

## 🚨 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| Port 5000 in use | Change PORT in .env |
| DB connection failed | Check DATABASE_URL, PostgreSQL running |
| Cannot find module | Run npm install |
| Prisma client error | Run npm run prisma:generate |
| 401 Unauthorized | Check JWT token, verify auth header |

## 📦 Scripts

### Backend
```bash
npm run dev          # Start with nodemon
npm start            # Start production
npm run migrate      # Database migration
npm run db:push      # Push schema changes
npm run db:reset     # Reset database
npm run prisma:generate  # Generate client
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check code
npm run preview      # Preview build
```

## 🎯 Project Status

### Backend
✅ Infrastructure  
✅ Database schema  
✅ Middleware  
✅ Error handling  
❌ Routes (ready to build)
❌ Controllers (ready to build)

### Frontend
✅ All pages  
✅ Components  
✅ Routing  
✅ Animations  
⏳ API integration (waiting for routes)

## 📚 Documentation Map

```
START HERE → README_SETUP.md
     ↓
SETUP DB → SETUP_GUIDE.md
     ↓
UNDERSTAND → BACKEND_ARCHITECTURE.md
     ↓
VISUALIZE → API_ARCHITECTURE.md
     ↓
BUILD → backend/README.md
     ↓
VERIFY → VERIFICATION_CHECKLIST.md
```

## 🚀 Quick Deploy (Railway)

```
1. Push code to GitHub
2. Connect GitHub to Railway
3. Add PostgreSQL service
4. Set BUILD: npm install && npm run migrate:prod
5. Set START: npm start
6. Configure DATABASE_URL from PostgreSQL
7. Set other env vars
8. Deploy
```

## 📞 Quick Debugging

```bash
# Test server is running
curl http://localhost:5000/api/health

# View database
npx prisma studio

# Check logs
# Look at terminal output

# Test frontend API
# Open DevTools (F12) → Network tab

# Database schema
# cat prisma/schema.prisma
```

## 🎨 Design System (Frontend)

```
Colors (CSS Variables)
--bg-base: #07060a      (darkest)
--bg-surface: #09080e   (dark)
--bg-raised: #0f0d18    (lighter)
--accent: #6366f1       (indigo primary)
--green: #4ade80        (success)
--red: #f87171          (error)
--amber: #fbbf24        (warning)

Animations
fadeSlideIn: 0.35s      (page load)
slideInLeft: 0.35s      (sidebar items)
pulse: 2s               (skeleton loading)
```

## 🔗 Useful Links

- Prisma Docs: https://www.prisma.io/docs/
- Express Docs: https://expressjs.com/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- JWT: https://jwt.io/
- React Router: https://reactrouter.com/

## 🎓 Next Steps

1. **Read** SETUP_GUIDE.md (5 min)
2. **Setup** PostgreSQL (10 min)
3. **Run** npm install (2 min)
4. **Start** servers (1 min)
5. **Build** first route (30 min)
6. **Test** with Postman (10 min)

## ✨ You Are Here

```
┌─────────────────────────┐
│  Infrastructure Setup   │  ← YOU ARE HERE ✅
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  Build API Routes       │  ← NEXT STEP
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  Connect Frontend       │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  Test & Deploy          │
└─────────────────────────┘
```

---

**Last Updated:** May 2026  
**Status:** ✅ Ready to Build  
**Time to Production:** ~2-3 days of development
