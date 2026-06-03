#!/usr/bin/env node

/**
 * Environment Setup Script for Deployment
 * Ensures DATABASE_URL and other critical env vars are available
 * Runs during build/startup phase
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables...');

const backendEnvPath = path.join(__dirname, 'backend', '.env');

// Default environment variables
const defaults = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    PORT: process.env.PORT || '5000',
    DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
    JWT_SECRET: process.env.JWT_SECRET || 'TaskrSuperSecretKey2026_VerySecureKey123eKey123',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    API_PREFIX: process.env.API_PREFIX || '/api',
};

// Create .env content
const envContent = Object.entries(defaults)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

// Write .env file
try {
    fs.writeFileSync(backendEnvPath, envContent);
    console.log('✅ Environment file created/updated: backend/.env');
} catch (error) {
    console.error('❌ Failed to write .env file:', error.message);
    process.exit(1);
}

// Verify critical variables
const required = ['DATABASE_URL', 'JWT_SECRET', 'NODE_ENV'];
const missing = required.filter(key => !process.env[key] && defaults[key]);

if (missing.length === 0) {
    console.log('✅ All critical environment variables are set');
    console.log(`   NODE_ENV: ${defaults.NODE_ENV}`);
    console.log(`   DATABASE_URL: ${defaults.DATABASE_URL}`);
    console.log(`   JWT_SECRET: ${defaults.JWT_SECRET.substring(0, 20)}...`);
} else {
    console.warn(`⚠️  Using default values for: ${missing.join(', ')}`);
}

console.log('✅ Environment setup complete\n');