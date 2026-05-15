import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';


/**
 * Get all users
 * GET /api/users
 * Access: Private (Authenticated)
 */
export const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin Create User
 * POST /api/users
 * Access: Private (Admin Only)
 */
export const adminCreateUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'Member'
            }
        });

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete User
 * DELETE /api/users/:id
 * Access: Private (Admin Only)
 */
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Don't allow deleting self
        if (id === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot delete your own account." });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: "User removed successfully"
        });
    } catch (error) {
        next(error);
    }
};

