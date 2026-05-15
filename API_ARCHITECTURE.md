# Taskr Backend - API Architecture & Data Models

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│              http://localhost:5173                           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │ JWT Token in Header
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Express.js Server                           │
│              http://localhost:5000                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Middleware Stack                                     │  │
│  │ 1. Body Parser (JSON)                               │  │
│  │ 2. CORS (Cross-Origin)                              │  │
│  │ 3. Authentication (JWT)                             │  │
│  │ 4. Error Handler (Global)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Routes (/api/auth, /api/projects, /api/tasks)       │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Controllers (Business Logic)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Prisma ORM                                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬──────────────────────────────────┘
                         │ SQL Queries
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL Database                            │
│             (localhost:5432)                                │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users  │  │ Projects │  │ Tasks    │  │ Project  │   │
│  │ Table   │  │ Table    │  │ Table    │  │ Members  │   │
│  └─────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema & Relationships

```
┌─────────────────────────┐
│        USER             │
├─────────────────────────┤
│ • id (PK)              │
│ • name                 │
│ • email (UNIQUE)       │
│ • password (hashed)    │
│ • role (Admin/Member)  │
│ • createdAt            │
│ • updatedAt            │
└─────┬───────────────┬──┘
      │ owns          │ assigned to
      │               │
      ↓ 1:N           ↓ 1:N
  ┌──────────────┐  ┌──────────────┐
  │  PROJECT     │  │    TASK      │
  ├──────────────┤  ├──────────────┤
  │ • id (PK)    │  │ • id (PK)    │
  │ • name       │  │ • title      │
  │ • desc       │  │ • desc       │
  │ • status     │  │ • status     │
  │ • ownerId(FK)├──┤ • project(FK)│
  │ • createdAt  │  │ • assignee   │
  │ • updatedAt  │  │ • creator(FK)│
  └──────┬───────┘  │ • priority   │
         │          │ • dueDate    │
         │ M:N      │ • createdAt  │
         ↓          │ • updatedAt  │
  ┌─────────────────┐ └──────────────┘
  │ PROJECT_MEMBER  │
  ├─────────────────┤
  │ • id (PK)       │
  │ • projectId(FK) │
  │ • userId(FK)    │
  │ • createdAt     │
  └─────────────────┘
```

## Request/Response Flow

```
CLIENT REQUEST
    │
    ↓
┌─────────────────────────────────────┐
│ Express Receives Request            │
│ POST /api/auth/login                │
│ Headers: { Content-Type: ... }      │
│ Body: { email, password }           │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Body Parser Middleware              │
│ Parses JSON body                    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ CORS Middleware                     │
│ Checks origin: localhost:5173       │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Route Matched                       │
│ POST /api/auth/login                │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Controller (login function)         │
│ 1. Validate input                   │
│ 2. Query user from DB               │
│ 3. Compare password                 │
│ 4. Generate JWT token               │
│ 5. Return response                  │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ JSON Response                       │
│ 200 OK                              │
│ {                                   │
│   "success": true,                  │
│   "data": {                         │
│     "user": {...},                  │
│     "token": "eyJhbGc..."           │
│   }                                 │
│ }                                   │
└──────────────┬──────────────────────┘
               ↓
         FRONTEND
```

## Authentication Flow

```
USER REGISTRATION
    │
    ├─→ POST /api/auth/register
    ├─→ Validate email & password
    ├─→ Hash password with bcryptjs
    ├─→ Create user in database
    ├─→ Generate JWT token
    └─→ Return { user, token }

USER LOGIN
    │
    ├─→ POST /api/auth/login
    ├─→ Find user by email
    ├─→ Compare password hash
    ├─→ Generate JWT token
    └─→ Return { user, token }

PROTECTED REQUESTS
    │
    ├─→ GET /api/projects (with token)
    ├─→ Extract token from Authorization header
    │   Format: "Bearer eyJhbGc..."
    ├─→ Verify token signature & expiration
    ├─→ Extract userId from token
    ├─→ Pass to controller
    └─→ Controller has access to req.userId
```

## Error Handling Chain

```
Controller throws error
    │
    ├─→ If async: asyncHandler catches it
    │
    ↓
┌──────────────────────────────────┐
│ Error Handler Middleware         │
│ Checks error type:               │
│                                  │
│ Prisma P2002? → 409 Conflict     │
│ Prisma P2025? → 404 Not Found    │
│ JWT Error?   → 401 Unauthorized  │
│ Validation?  → 422 Unprocessable │
│ Other?       → 500 Server Error  │
└──────────────┬──────────────────┘
               │
               ↓
    ┌──────────────────────┐
    │ JSON Error Response  │
    │ {                    │
    │   "success": false,  │
    │   "message": "...",  │
    │   "error": "..."     │
    │ }                    │
    └──────────────────────┘
```

## Middleware Execution Order

```
Request Arrives
    ↓
express.json()           ← Parse JSON body
    ↓
cors()                   ← CORS validation
    ↓
health check (if /api/health)
    ↓
route.handler()
    ↓
authenticate (if protected route)
    ↓
asyncHandler(controller())
    ↓
errorHandler (catches any error)
    ↓
notFoundHandler (if no route matched)
    ↓
Response Sent
```

## Database Operation Flow

```
Controller requests data
    │
    ↓
Prisma ORM
    │
    ├─→ Validates input
    ├─→ Constructs SQL query
    └─→ Executes on PostgreSQL

Database returns result
    │
    ↓
Prisma parses response
    │
    ↓
Returns JavaScript object to controller
    │
    ↓
Controller formats response
    │
    ↓
JSON sent to client
```

## Common Routes (Ready to Build)

```
AUTH ROUTES
├─ POST   /api/auth/register        → Create new user
├─ POST   /api/auth/login           → Authenticate user
├─ GET    /api/auth/profile         → Get user profile (protected)
├─ PUT    /api/auth/profile         → Update profile (protected)
└─ POST   /api/auth/logout          → Logout (protected)

PROJECT ROUTES
├─ GET    /api/projects             → List all projects (protected)
├─ POST   /api/projects             → Create project (protected)
├─ GET    /api/projects/:id         → Get project details (protected)
├─ PUT    /api/projects/:id         → Update project (protected)
├─ DELETE /api/projects/:id         → Delete project (protected)
├─ GET    /api/projects/:id/members → List project members (protected)
└─ POST   /api/projects/:id/members → Add member (protected)

TASK ROUTES
├─ GET    /api/tasks                → List tasks (protected)
├─ POST   /api/tasks                → Create task (protected)
├─ GET    /api/tasks/:id            → Get task details (protected)
├─ PUT    /api/tasks/:id            → Update task (protected)
├─ DELETE /api/tasks/:id            → Delete task (protected)
└─ PUT    /api/tasks/:id/status     → Update status (protected)
```

## Environment & Deployment

```
DEVELOPMENT
├─ Database: localhost:5432
├─ API URL: http://localhost:5000
├─ Frontend: http://localhost:5173
├─ Logging: query, warn, error
└─ Restart: Nodemon watches files

PRODUCTION (Railway)
├─ Database: Railway PostgreSQL
├─ API URL: https://taskr-api.railway.app
├─ Frontend: https://taskr.vercel.app
├─ Logging: warn, error
└─ Built with: npm run build + npm start
```

## Key Files & Locations

```
src/config/env.js           → Configuration values
src/config/database.js      → Prisma client
src/middleware/auth.js      → JWT operations
src/middleware/errorHandler → Error handling
src/utils/password.js       → Hash & compare
src/utils/validation.js     → Input validation
src/app.js                  → Express setup
src/server.js               → Server entry
prisma/schema.prisma        → Database schema
.env                        → Environment variables
```

---

**Ready to implement routes!** Follow BACKEND_ARCHITECTURE.md for patterns.
