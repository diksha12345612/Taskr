# Taskr Backend Architecture Overview

## Project Structure Explanation

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── .gitignore             # Ignore migrations in version control
│
├── src/
│   ├── config/
│   │   ├── env.js             # Environment variables (loaded & validated)
│   │   └── database.js        # Prisma client initialization
│   │
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & token generation
│   │   └── errorHandler.js    # Global error handling & 404
│   │
│   ├── routes/                # API endpoint definitions (TODO)
│   │   ├── auth.js            # /api/auth/*
│   │   ├── projects.js        # /api/projects/*
│   │   └── tasks.js           # /api/tasks/*
│   │
│   ├── controllers/           # Business logic (TODO)
│   │   ├── auth.js            # Auth logic
│   │   ├── projects.js        # Project management
│   │   └── tasks.js           # Task management
│   │
│   ├── utils/
│   │   ├── password.js        # Hash & compare passwords
│   │   └── validation.js      # Input validation rules
│   │
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
│
├── .env                       # Environment variables (local)
├── .env.example               # Environment template
├── package.json               # Dependencies & scripts
└── README.md                  # Complete documentation
```

## Data Flow

```
Request
  ↓
Express Middleware (body parser, CORS)
  ↓
Route Handler (GET /api/tasks/:id)
  ↓
Authentication Middleware (validate JWT)
  ↓
Controller (business logic)
  ↓
Prisma Query (database operation)
  ↓
Response JSON
```

## Key Components

### 1. config/env.js
- Loads environment variables
- Validates required variables
- Provides single config object
- Usage: `import { config } from './config/env.js'`

### 2. config/database.js
- Creates Prisma Client instance
- Handles connection lifecycle
- Logs queries in development
- Usage: `import prisma from './config/database.js'`

### 3. middleware/auth.js
- `verifyToken()` - Validate JWT
- `generateToken()` - Create JWT
- `authenticate` - Express middleware to check token
- Usage: `app.use(authenticate)` for protected routes

### 4. middleware/errorHandler.js
- `errorHandler` - Catches all errors
- `notFoundHandler` - 404 responses
- `asyncHandler` - Wraps async controllers
- Usage: Must be last middleware registered

### 5. utils/password.js
- `hashPassword()` - Hash with bcryptjs
- `comparePassword()` - Verify password
- Usage in auth controller for registration/login

### 6. utils/validation.js
- Email, password, name validation
- Task status, priority validation
- Project status validation
- Usage before saving to database

## Database Schema

### User
```
- id (String, primary key)
- name, email, password
- role (Admin/Member)
- Created/Updated timestamps
- Relations: projects, tasks, memberships
```

### Project
```
- id, name, description
- status (Active/Review/Hold/Completed)
- ownerId (FK to User)
- Created/Updated timestamps
- Relations: members, tasks, owner
```

### ProjectMember (Junction Table)
```
- id
- projectId, userId (FK)
- Ensures unique project-user pairs
```

### Task
```
- id, title, description
- status (Todo/In Progress/Done)
- priority (High/Medium/Low)
- dueDate, projectId, assigneeId, creatorId
- Created/Updated timestamps
- Relations: project, assignee, creator
```

## API Layers

### 1. Routes (API Endpoints)
```javascript
// src/routes/auth.js
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);
```

### 2. Controllers (Business Logic)
```javascript
// src/controllers/auth.js
export async function register(req, res) {
  // Validate input
  // Hash password
  // Create user in database
  // Return token
}
```

### 3. Middleware (Cross-cutting Concerns)
```javascript
// src/middleware/auth.js
export const authenticate = (req, res, next) => {
  // Check Authorization header
  // Verify JWT token
  // Set req.userId
  // Pass to controller
}
```

## Error Handling Flow

```
Error thrown in controller
  ↓
asyncHandler catches it
  ↓
Passes to errorHandler middleware
  ↓
Checks error type:
  - Prisma validation? → 409 Conflict
  - JWT invalid? → 401 Unauthorized
  - Generic error? → 500 Server Error
  ↓
Returns JSON response
```

## Environment Variables

```env
# Server
NODE_ENV=development        # development|production
PORT=5000                   # Server port

# Database
DATABASE_URL=postgresql://  # Connection string

# JWT
JWT_SECRET=                 # Min 32 characters
JWT_EXPIRE=7d              # Token expiration

# CORS
CORS_ORIGIN=http://localhost:5173  # Frontend URL

# API
API_PREFIX=/api             # Route prefix
```

## Deployment Ready Features

✓ Prisma ORM (database agnostic)
✓ Environment variable validation
✓ Error handling middleware
✓ JWT authentication
✓ CORS configuration
✓ Graceful shutdown
✓ ES Modules
✓ PostgreSQL support
✓ Railway compatible
✓ Input validation
✓ Password hashing

## Next Steps: Building Routes

When implementing routes:

1. **Create route file** (src/routes/auth.js)
   ```javascript
   import express from 'express';
   import { authenticate } from '../middleware/auth.js';
   import * as controller from '../controllers/auth.js';
   
   const router = express.Router();
   router.post('/register', controller.register);
   router.post('/login', controller.login);
   export default router;
   ```

2. **Create controller** (src/controllers/auth.js)
   ```javascript
   import prisma from '../config/database.js';
   import { hashPassword } from '../utils/password.js';
   import { generateToken } from '../middleware/auth.js';
   import { asyncHandler } from '../middleware/errorHandler.js';
   
   export const register = asyncHandler(async (req, res) => {
     // Implementation
   });
   ```

3. **Register route in app.js**
   ```javascript
   import authRoutes from './routes/auth.js';
   app.use(`${config.api_prefix}/auth`, authRoutes);
   ```

## Standards & Conventions

- **Error codes:** 4xx client, 5xx server
- **Response format:** `{ success: true/false, message, data, error }`
- **Naming:** camelCase for JS, snake_case for database
- **Async:** All controllers use async/await
- **Validation:** Check input before database operations
- **Timestamps:** All models have createdAt/updatedAt

---

Ready to implement routes and controllers!
