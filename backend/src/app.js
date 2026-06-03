import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';

// Import Middlewares
import { errorHandler } from './middleware/errorHandler.js';

// Import Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRoutes from './routes/leaves.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * ==========================================
 * GLOBAL MIDDLEWARE
 * ==========================================
 */

// Request Logger (TOP LEVEL)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
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
 * API ROUTES
 * ==========================================
 */

// Health check endpoint
app.get(`${config.api_prefix}/health`, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Taskr API is healthy and running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Register modules
app.use(`${config.api_prefix}/auth`, authRoutes);
app.use(`${config.api_prefix}/projects`, projectRoutes);
app.use(`${config.api_prefix}/tasks`, taskRoutes);
app.use(`${config.api_prefix}/users`, userRoutes);
app.use(`${config.api_prefix}/attendance`, attendanceRoutes);
app.use(`${config.api_prefix}/leaves`, leaveRoutes);

/**
 * ==========================================
 * STATIC FILE SERVING (FOR DEPLOYMENT)
 * ==========================================
 */

// Serve static assets from the React app
const frontendPath = path.join(__dirname, '../../taskr-app/dist');
app.use(express.static(frontendPath));

// Catch-all route for any non-API request to serve index.html (React Router)
app.get('*', (req, res, next) => {
    if (req.url.startsWith(config.api_prefix)) return next();
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
        if (err) {
            // Fallback for local development or if build is missing
            res.status(200).send('API is running. Frontend build not found.');
        }
    });
});

/**
 * ==========================================
 * ERROR HANDLING
 * ==========================================
 */

// Global exception/error handler
app.use(errorHandler);

export default app;