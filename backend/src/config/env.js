import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Server
    node_env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    api_prefix: process.env.API_PREFIX || '/api',

    // Database
    database_url: process.env.DATABASE_URL,

    // JWT
    jwt_secret: process.env.JWT_SECRET,
    jwt_expire: process.env.JWT_EXPIRE || '7d',

    // CORS
    cors_origin: process.env.CORS_ORIGIN || 'http://localhost:5173',

    // Utilities
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
};

// Validate critical environment variables
if (!config.database_url) {
    throw new Error('DATABASE_URL environment variable is required');
}

if (!config.jwt_secret || config.jwt_secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
}

export default config;