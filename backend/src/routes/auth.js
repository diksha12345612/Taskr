import express from 'express';
import { register, login, getProfile, logout } from '../controllers/auth.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * Public Routes (No authentication required)
 */

// Register a new user
// POST /api/auth/register
// Body: { name, email, password, passwordConfirm }
router.post('/register', register);

// Login user
// POST /api/auth/login
// Body: { email, password }
router.post('/login', login);

/**
 * Protected Routes (Authentication required)
 */

// Get current user profile
// GET /api/auth/profile
router.get('/profile', authenticate, getProfile);

// Logout user
// POST /api/auth/logout
router.post('/logout', authenticate, logout);

export default router;