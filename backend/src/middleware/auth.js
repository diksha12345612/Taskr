import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/env.js';

const prisma = new PrismaClient();

// Verify JWT Token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwt_secret);
    } catch (err) {
        throw new Error(err.message);
    }
};

// Generate JWT Token
export const generateToken = (userId) => {
    return jwt.sign({ userId },
        config.jwt_secret, { expiresIn: config.jwt_expire }
    );
};

// Authenticate JWT Middleware
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }

        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        
        // Fetch user and attach to req
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) throw new Error('User not found');
        req.user = user;
        
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }
};

// Authorize roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};