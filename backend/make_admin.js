import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function makeAdmin() {
  const user = await prisma.user.findFirst({
    where: { email: { contains: 'diksha' } } // or just update all
  });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'Admin' }
    });
    console.log(`Successfully updated ${user.name} to Admin`);
  } else {
    // just make everyone Admin for testing
    await prisma.user.updateMany({
      data: { role: 'Admin' }
    });
    console.log('Updated all users to Admin');
  }
}

makeAdmin().catch(console.error).finally(() => prisma.$disconnect());
