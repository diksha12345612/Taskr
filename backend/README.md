# Taskr Backend API

A modern, scalable Node.js backend for the Taskr team task management application.

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment:** dotenv
- **CORS:** cors

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

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js

## Getting Started

### 1. Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 2. Database Setup

#### Local PostgreSQL Setup

```bash
# On Windows
# Start PostgreSQL service and connect to psql

# Create database
createdb taskr_db

# Create user (if not exists)
createuser -P taskr_user
```

#### Set Password for User

```bash
# Connect to PostgreSQL
psql -U postgres

# Set password for taskr_user
\password taskr_user

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE taskr_db TO taskr_user;

# Exit
\q
```

### 3. Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://taskr_user:taskr_password@localhost:5432/taskr_db
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_required
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
API_PREFIX=/api
```

### 4. Database Migration

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run migrate

# Or push schema (for development)
npm run db:push
```

### 5. Start Development Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
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
  "message": "Server is running",
  "timestamp": "2026-05-15T10:30:00.000Z"
}
```

## Database Operations

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Create a new migration
npm run migrate

# Apply migrations in production
npm run migrate:prod

# Push schema changes directly (development only)
npm run db:push

# Reset database (CAUTION - deletes all data)
npm run db:reset
```

## API Endpoints (Ready to Implement)

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

## Deployment (Railway)

### Railway Setup

1. Connect GitHub repository to Railway
2. Create PostgreSQL database on Railway
3. Set environment variables in Railway dashboard
4. Configure build command: `npm install && npm run migrate:prod`
5. Configure start command: `npm start`

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000 (Railway sets this automatically)
DATABASE_URL=<railway-postgres-url>
JWT_SECRET=<strong-32-char-secret>
JWT_EXPIRE=7d
CORS_ORIGIN=<your-frontend-url>
API_PREFIX=/api
```

## Development Tips

### Hot Reload

The development server uses `nodemon` for automatic restart on file changes.

```bash
npm run dev
```

### Debugging

Enable debug logging in development:

```javascript
// In src/config/database.js
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Database Browser

View and manage database using Prisma Studio:

```bash
npx prisma studio
```

## Best Practices

1. **Always validate input** - Use validation utilities in `src/utils/validation.js`
2. **Use middleware** - Apply `authenticate` to protected routes
3. **Handle errors** - Use `asyncHandler` to catch async errors
4. **Environment variables** - Never hardcode secrets
5. **Database queries** - Use Prisma for all database operations
6. **Password hashing** - Always hash passwords before storing
7. **Rate limiting** - Implement in production
8. **Input sanitization** - Validate and sanitize user input

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change PORT in .env
```

### Database Connection Failed

```bash
# Verify PostgreSQL is running
# Check DATABASE_URL in .env
# Ensure user has correct permissions
# Try resetting the database: npm run db:reset
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npm run prisma:generate

# Clear Prisma cache
npx prisma generate --skip-engine-check
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
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
