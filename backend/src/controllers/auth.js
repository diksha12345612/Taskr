import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { isValidEmail, isValidPassword, isValidName } from '../utils/validation.js';
import { generateToken } from '../middleware/auth.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async(req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const role = 'Member'; // Force Member role for security

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

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async(req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email address' });
        }

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
            // Return success even if user not found to prevent email enumeration
            return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: { resetPasswordToken, resetPasswordExpires }
        });

        // Send Email
        const resetURL = `http://localhost:5174/reset-password/${resetToken}`;
        const message = `Forgot your password? Reset it here: ${resetURL}\nIf you didn't forget your password, please ignore this email.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message
            });
            res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
        } catch (error) {
            await prisma.user.update({
                where: { id: user.id },
                data: { resetPasswordToken: null, resetPasswordExpires: null }
            });
            console.error(error);
            return res.status(500).json({ success: false, message: 'There was an error sending the email. Try again later!' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Reset Password
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = async(req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
        }

        const { password } = req.body;
        if (!isValidPassword(password)) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        const hashedPassword = await hashPassword(password);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        res.status(200).json({ success: true, message: 'Password reset successful. Please login.' });
    } catch (error) {
        next(error);
    }
};