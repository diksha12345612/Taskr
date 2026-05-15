// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV === 'development';

    // Prisma validation error
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'field';
        return res.status(409).json({
            success: false,
            message: `A record with this ${field} already exists`,
            error: isDev ? err.message : undefined,
        });
    }

    // Prisma record not found
    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Record not found',
            error: isDev ? err.message : undefined,
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: isDev ? err.message : undefined,
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors: isDev ? err.details : undefined,
        });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        error: isDev ? err : undefined,
    });
};

// 404 Not Found Handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};