# Authentication Module - Setup & Testing Guide

## Overview

Your Taskr backend now has a complete JWT-based authentication system with:
- ✅ User registration with email uniqueness
- ✅ Secure password hashing (bcrypt)
- ✅ JWT token generation and verification
- ✅ Protected routes middleware
- ✅ Proper error handling
- ✅ Clean, modular architecture

---

## Files Created/Updated

### 1. **src/controllers/auth.js** - Authentication Business Logic
Functions:
- `register(req, res, next)` - User registration
- `login(req, res, next)` - User login
- `getProfile(req, res, next)` - Get authenticated user profile
- `logout(req, res, next)` - Logout endpoint

### 2. **src/routes/auth.js** - Route Definitions
Endpoints:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (protected)
- `POST /api/auth/logout` - Logout (protected)

### 3. **src/app.js** - Updated to Register Routes
- Auth routes now registered at `/api/auth`
- Error handling middleware in place
- CORS enabled

### 4. **src/middleware/auth.js** - Already Configured
- `generateToken(userId)` - Generate JWT
- `verifyToken(token)` - Verify JWT
- `authenticate` - Middleware for protected routes

---

## Starting the Server

```bash
cd backend
npm run dev
```

Expected output:
```
✓ Database connected successfully
✓ Server running on http://localhost:5000
✓ API available at http://localhost:5000/api
```

---

## API Endpoints Reference

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clp8x9z5z0000nf8x...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Member"
    }
  }
}
```

**Error Responses:**
- Missing fields (400):
```json
{
  "success": false,
  "message": "Please provide all required fields: name, email, password, passwordConfirm"
}
```

- Invalid email (400):
```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

- Email already exists (409):
```json
{
  "success": false,
  "message": "Email already registered. Please login instead."
}
```

- Passwords don't match (400):
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clp8x9z5z0000nf8x...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Member"
    }
  }
}
```

**Error Responses:**
- Missing email or password (400):
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

- Invalid credentials (401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Profile (Protected)

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "clp8x9z5z0000nf8x...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Member",
      "createdAt": "2026-05-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### 4. Logout (Protected)

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful. Please remove token from client."
}
```

---

## Postman Collection

### How to Use

1. Open Postman
2. Click "Import"
3. Select "Raw text"
4. Copy the collection JSON below
5. Paste and import

### Postman Collection JSON

```json
{
  "info": {
    "name": "Taskr Authentication API",
    "description": "Complete auth module for Taskr backend",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"passwordConfirm\": \"password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}",
                "description": "Use the token from login response"
              }
            ],
            "url": {
              "raw": "http://localhost:5000/api/auth/profile",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "profile"]
            }
          }
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "http://localhost:5000/api/auth/logout",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "logout"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Manual Testing with curl

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Copy the token from response.

### 3. Get Profile (Replace {token} with actual token)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}"
```

### 4. Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}"
```

---

## Testing in Frontend

### Update AuthContext.jsx

```javascript
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    const { token, user } = response.data.data;
    
    // Store token
    localStorage.setItem('token', token);
    
    // Update auth state
    setUser(user);
    setIsAuthenticated(true);
    
    return true;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message);
    return false;
  }
};

const register = async (name, email, password, passwordConfirm) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      passwordConfirm
    });
    
    const { token, user } = response.data.data;
    
    // Store token
    localStorage.setItem('token', token);
    
    // Update auth state
    setUser(user);
    setIsAuthenticated(true);
    
    return true;
  } catch (error) {
    console.error('Registration failed:', error.response?.data?.message);
    return false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  setUser(null);
  setIsAuthenticated(false);
};
```

---

## Validation Rules

### Registration Validation
- **Name**: Minimum 2 characters
- **Email**: Valid email format
- **Password**: Minimum 6 characters
- **Password Confirm**: Must match password
- **Email**: Must be unique (not already registered)

### Login Validation
- **Email**: Valid email format
- **Password**: Must be provided
- **Credentials**: Email and password must match

---

## HTTP Status Codes

| Code | Scenario |
|------|----------|
| 200 | Success (login, profile, logout) |
| 201 | Created (registration) |
| 400 | Bad request (validation errors) |
| 401 | Unauthorized (invalid credentials, no token) |
| 409 | Conflict (email already exists) |
| 500 | Server error |

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (development mode only)"
}
```

The controller catches all errors and passes them to the global error handler middleware.

---

## Architecture Overview

```
User Request
    ↓
Express Route (routes/auth.js)
    ↓
Controller (controllers/auth.js)
    ├─ Validate input
    ├─ Check database constraints
    ├─ Hash password / Verify password
    ├─ Generate JWT token
    └─ Return response
    ↓
Global Error Handler (middleware/errorHandler.js)
    └─ Format error response
    ↓
User Response
```

---

## Security Features

✅ **Password Hashing**: bcryptjs with 10 salt rounds
✅ **JWT Tokens**: Signed with secret, expires in 7 days
✅ **Input Validation**: Email, password, name validation
✅ **Email Uniqueness**: Database unique constraint + application validation
✅ **Generic Error Messages**: Don't reveal if email exists
✅ **Protected Routes**: Middleware validates token
✅ **CORS Enabled**: Cross-origin requests allowed from frontend
✅ **Rate Limiting Ready**: Can be added to prevent brute force

---

## Next Steps

1. **Start server**: `npm run dev`
2. **Test registration**: POST /api/auth/register
3. **Test login**: POST /api/auth/login
4. **Test protected route**: GET /api/auth/profile with token
5. **Update frontend**: Wire up React forms to these endpoints
6. **Implement projects/tasks**: Similar pattern to auth

---

## Common Issues & Solutions

### "Invalid token" error
- Token is invalid or expired
- Check Authorization header format: `Bearer {token}`
- Regenerate token by logging in again

### "Email already registered"
- User exists in database
- Login instead of registering
- Use different email for new account

### "Passwords do not match"
- password and passwordConfirm don't match exactly
- Check spelling and whitespace

### "User not found" on profile
- Token is for deleted user
- Login again to get valid token

### CORS error
- Make sure `CORS_ORIGIN=http://localhost:5173` in .env
- Frontend must use correct API URL

---

## Database Queries Used

### Find user by email (before login)
```javascript
const user = await prisma.user.findUnique({
  where: { email: email.toLowerCase() }
});
```

### Create new user (during registration)
```javascript
const user = await prisma.user.create({
  data: {
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'Member'
  },
  select: { id: true, name: true, email: true, role: true }
});
```

### Find user by ID (for profile)
```javascript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, name: true, email: true, role: true, createdAt: true }
});
```

---

## Token Structure (JWT)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHA4eDl6NXowMDAwbmY4eCIsImlhdCI6MTcxNTc4NzAwMCwiZXhwIjoxNzE2MzkxODAwfQ.abc123...
```

Decoded:
```json
{
  "userId": "clp8x9z5z0000nf8x",
  "iat": 1715787000,
  "exp": 1716391800
}
```

---

## Configuration

From `.env`:
```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_env_min_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
API_PREFIX=/api
```

---

## What's Next

After authentication is working:

1. **Projects API** - CRUD endpoints for projects
2. **Tasks API** - CRUD endpoints for tasks
3. **User profiles** - Update user information
4. **Frontend integration** - Connect React to API
5. **Role-based access** - Admin-only endpoints
6. **Rate limiting** - Prevent brute force attacks

---

**Authentication Module:** ✅ Complete & Ready to Test
**Start Server:** `npm run dev`
**Test Registration:** POST /api/auth/register
