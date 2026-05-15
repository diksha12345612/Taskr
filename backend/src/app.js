import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';

// Import Middlewares
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRoutes from './routes/leaves.js';

const app = express();

/**
 * ==========================================
 * GLOBAL MIDDLEWARE
 * ==========================================
 */

// Request Logger (TOP LEVEL)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method !== 'GET') console.log('Body:', JSON.stringify(req.body, null, 2));
    next();
});

// Enable CORS
app.use(cors({
    origin: config.cors_origin,
    credentials: true,
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

/**
 * ==========================================
 * UTILITY ROUTES
 * ==========================================
 */

// Health check endpoint (for monitoring and infrastructure)
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'UP',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
});

/**
 * ==========================================
 * API ROUTES
 * ==========================================
 */

// Register modules
app.use(`${config.api_prefix}/auth`, authRoutes);
app.use(`${config.api_prefix}/projects`, projectRoutes);
app.use(`${config.api_prefix}/tasks`, taskRoutes);
app.use(`${config.api_prefix}/users`, userRoutes);
app.use(`${config.api_prefix}/attendance`, attendanceRoutes);
app.use(`${config.api_prefix}/leaves`, leaveRoutes);

/**
 * ==========================================
 * ERROR HANDLING
 * ==========================================
 */

// Catch all for undefined routes (404)
app.use(notFoundHandler);

// Global exception/error handler
app.use(errorHandler);

export default app;