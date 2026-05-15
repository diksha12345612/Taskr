import prisma from '../config/database.js';

/**
 * Middleware to restrict access based on user roles
 * @param {...string} allowedRoles - List of roles that have access (e.g., 'Admin', 'Member')
 * @returns {Function} Express middleware function
 */
export const allowRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // 1. Check if userId exists (set by authenticate middleware)
            if (!req.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required. No user ID found.',
                });
            }

            // 2. Extract user data and role from database if not already on request
            // This ensures we always have the most up-to-date role from the DB
            if (!req.user) {
                const user = await prisma.user.findUnique({
                    where: { id: req.userId },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                });

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found',
                    });
                }

                // Attach user object to request for downstream use
                req.user = user;
            }

            // 3. Role validation logic
            // Admin always has full access
            if (req.user.role === 'Admin') {
                return next();
            }

            // Check if the user's role is in the list of allowed roles
            const isAuthorized = allowedRoles.includes(req.user.role);

            if (!isAuthorized) {
                return res.status(403).json({
                    success: false,
                    message: 'Access Denied: You do not have the required permissions for this resource.',
                    requiredRoles: allowedRoles
                });
            }

            next();
        } catch (error) {
            // Pass any errors to the global error handler
            next(error);
        }
    };
};
