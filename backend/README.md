# Taskr Backend API

A modern, scalable Node.js backend for the Taskr team task management application with JWT authentication, role-based access control, and comprehensive task management APIs.

## Tech Stack

- **Runtime:** Node.js (v24+)
- **Framework:** Express.js (v4.18.2)
- **Database:** SQLite 3
- **ORM:** Prisma (v5.8.0)
- **Authentication:** JWT (JSON Web Tokens) with bcryptjs
- **Port:** 5000
- **CORS:** Enabled for frontend (http://localhost:5173)
- **Environment:** dotenv with secure key management

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── env.js             # Environment configuration
│   │   └── database.js        # Prisma client setup
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js    # Error handling
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── projects.js        # Project endpoints
│   │   └── tasks.js           # Task endpoints
│   ├── controllers/
│   │   ├── auth.js            # Auth logic
│   │   ├── projects.js        # Project logic
│   │   └── tasks.js           # Task logic
│   ├── utils/
│   │   ├── password.js        # Password utilities
│   │   └── validation.js      # Input validation
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── .env                       # Environment variables (local)
├── .env.example               # Environment template
├── package.json               # Dependencies
├── prisma/.gitignore          # Prisma artifacts
└── README.md                  # This file
```

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v24 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- No external database required (SQLite file-based)

## Getting Started

### 1. Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default `.env` values:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=TaskrSuperSecretKey2026_VerySecureKey123eKey123
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
API_PREFIX=/api
```

The SQLite database file (`dev.db`) will be created automatically on first run.

### 3. Database Setup

```bash
# Push schema to database (creates dev.db if doesn't exist)
npx prisma db push

# Optional: Seed database with sample data
npm run seed
```

### 4. Start Development Server

```bash
# Development mode (with auto-reload)
npm start
```

Server will start at: `http://localhost:5000`

### Health Check

```bash
# Test if server is running
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Database Operations

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Push schema to database (SQLite)
npx prisma db push

# Open Prisma Studio (GUI for database)
npx prisma studio

# Reset database (CAUTION - deletes all data)
npx prisma db reset
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/members` - Get project members
- `POST /api/projects/:id/members` - Add member to project

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/:id/status` - Update task status

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change PORT in .env
```

### Database File Not Found

```bash
# Reset database (creates new dev.db)
npx prisma db reset

# Or manually delete dev.db and restart server
del dev.db
npm start
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and reinstall
rm -r node_modules
npm install
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| DATABASE_URL | SQLite database path | file:./dev.db |
| JWT_SECRET | JWT signing secret | TaskrSuperSecretKey2026_VerySecureKey123eKey123 |
| JWT_EXPIRE | JWT expiration time | 7d |
| CORS_ORIGIN | Frontend CORS origin | http://localhost:5173 |
| API_PREFIX | API route prefix | /api |

## Features Implemented

- ✅ JWT Authentication (email/password)
- ✅ Password Hashing (bcryptjs)
- ✅ Role-Based Access Control (Admin/Member)
- ✅ Password Reset with Token Validation
- ✅ User Profile Management
- ✅ Project Management
- ✅ Task Management
- ✅ Attendance Tracking
- ✅ Leave Management
- ✅ Team Management
- ✅ Error Handling Middleware
- ✅ CORS Configuration
- ✅ Environment-based Configuration

## Security Considerations

1. **JWT Secret:** Min 32 characters, change in production
2. **Password Requirements:** Min 6 chars, uppercase, lowercase, number, special char
3. **CORS:** Restricted to frontend origin only
4. **Token Expiry:** Automatically expires after 7 days
5. **Password Reset:** One-time token with 1-hour expiration
6. **Role Enforcement:** Backend forces 'Member' role on signup for security

## Related Documentation

- [Prisma Schema Reference](./PRISMA_SCHEMA_REFERENCE.md)
- [Prisma Complete Guide](./PRISMA_COMPLETE_GUIDE.md)
- [Authentication Setup Guide](./AUTH_SETUP.md)
- [Setup Checklist](./SETUP_CHECKLIST.md)

## License

MIT
| DATABASE_URL | PostgreSQL connection string | Required |
| JWT_SECRET | Secret key for JWT tokens | Required |
| JWT_EXPIRE | Token expiration time | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |
| API_PREFIX | API route prefix | /api |

## Performance Optimization

- Connection pooling via Prisma
- Database indexing (configured in schema.prisma)
- Request body size limit: 10KB
- CORS enabled for frontend only
- Error logging in production

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs (10 salt rounds)
- Environment variable validation
- CORS protection
- Input validation
- Error handling without exposing internals

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check Prisma documentation: https://www.prisma.io/docs/
- Express documentation: https://expressjs.com/
- PostgreSQL documentation: https://www.postgresql.org/docs/

---

**Last Updated:** May 2026
**Version:** 1.0.0
