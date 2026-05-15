import app from './app.js';
import { config } from './config/env.js';
import prisma from './config/database.js';

// Start server
const server = app.listen(config.port, () => {
    console.log(`
╔════════════════════════════════════════╗
║         Taskr Backend Server           ║
╚════════════════════════════════════════╝

  Environment: ${config.node_env}
  Port: ${config.port}
  API Prefix: ${config.api_prefix}
  
  Ready to accept connections...
  `);
});

// Graceful shutdown
process.on('SIGTERM', async() => {
    console.log('\n✗ SIGTERM signal received: closing HTTP server');
    server.close(async() => {
        console.log('✓ HTTP server closed');
        await prisma.$disconnect();
        console.log('✓ Database disconnected');
        process.exit(0);
    });
});

process.on('SIGINT', async() => {
    console.log('\n✗ SIGINT signal received: closing HTTP server');
    server.close(async() => {
        console.log('✓ HTTP server closed');
        await prisma.$disconnect();
        console.log('✓ Database disconnected');
        process.exit(0);
    });
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('✗ Uncaught Exception:', err);
    process.exit(1);
});

export default server;