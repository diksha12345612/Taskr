import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { isValidEmail, isValidPassword, isValidName } from '../utils/validation.js';
import { generateToken } from '../middleware/auth.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async(req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const passwordConfirm = req.body.passwordConfirm || password; // Fallback if not provided

        // ============ Validation ============
        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, password',
            });
        }

        // Validate name
        if (!isValidName(name)) {
            return res.status(400).json({
                success: false,
                message: 'Name must be at least 2 characters long',
            });
        }

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
            });
        }

        // Validate password
        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long',
            });
        }

        // Check passwords match
        if (password !== passwordConfirm) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        // ============ Check if user exists ============
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered. Please login instead.',
            });
        }

        // ============ Hash password and create user ============
        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashedPassword,
                role: role || 'Member', // Use provided role or default to Member
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        // ============ Generate token ============
        const token = generateToken(user.id);

        // ============ Return response ============
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        // ============ Validation ============
        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
            });
        }

        // ============ Find user by email ============
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // ============ Verify password ============
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // ============ Generate token ============
        const token = generateToken(user.id);

        // ============ Return response ============
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 * Requires: authenticate middleware
 */
export const getProfile = async(req, res, next) => {
    try {
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user (client-side: remove token)
 * POST /api/auth/logout
 * Requires: authenticate middleware
 */
export const logout = async(req, res, next) => {
    try {
        // Token is removed client-side from localStorage
        res.status(200).json({
            success: true,
            message: 'Logout successful. Please remove token from client.',
        });
    } catch (error) {
        next(error);
    }
};