import { PrismaClient } from '@prisma/client';
import { config } from './env.js';

const prisma = new PrismaClient({
    log: config.isDev ?
        ['query', 'warn', 'error'] :
        ['warn', 'error'],
});

// Handle Prisma Client connection
prisma.$connect()
    .then(() => {
        console.log('✓ Database connected successfully');
    })
    .catch((err) => {
        console.error('✗ Failed to connect to database:', err.message);
        process.exit(1);
    });

// Handle graceful shutdown
process.on('SIGINT', async() => {
    await prisma.$disconnect();
    process.exit(0);
});

export default prisma;