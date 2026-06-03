import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function makeAdmin() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@example.com' }
    });
    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'Admin' }
        });
        console.log(`✓ Successfully updated ${user.name} to Admin role`);
    } else {
        console.log('✗ Admin user not found');
    }
}

makeAdmin().catch(console.error).finally(() => prisma.$disconnect());