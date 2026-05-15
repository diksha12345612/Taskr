import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding database...');

    // 1. Clean existing data (in order of dependencies)
    console.log('Cleaning database...');
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'System Admin',
            email: 'admin@taskr.com',
            password: hashedPassword,
            role: 'Admin',
        },
    });

    const member1 = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedPassword,
            role: 'Member',
        },
    });

    const member2 = await prisma.user.create({
        data: {
            name: 'Sarah Smith',
            email: 'sarah@example.com',
            password: hashedPassword,
            role: 'Member',
        },
    });

    const member3 = await prisma.user.create({
        data: {
            name: 'Mike Johnson',
            email: 'mike@example.com',
            password: hashedPassword,
            role: 'Member',
        },
    });

    // 3. Create Projects
    console.log('Creating projects...');
    const project1 = await prisma.project.create({
        data: {
            name: 'Taskr Backend API',
            description: 'Developing the core REST API and database integration for the Taskr ecosystem.',
            status: 'Active',
            progress: 60,
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'React Dashboard UI',
            description: 'Building the modern administrative dashboard using React and Tailwind CSS.',
            status: 'Active',
            progress: 35,
        },
    });

    const project3 = await prisma.project.create({
        data: {
            name: 'Mobile App Discovery',
            description: 'Research and prototyping for the upcoming Taskr mobile application.',
            status: 'Review',
            progress: 90,
        },
    });

    // 4. Create Tasks
    console.log('Creating tasks...');
    const tasks = [
        // Project 1 Tasks
        { title: 'Define API Schema', priority: 'High', status: 'Completed', projectId: project1.id, assigneeId: admin.id },
        { title: 'Implement Auth Module', priority: 'High', status: 'Completed', projectId: project1.id, assigneeId: member1.id },
        { title: 'Setup Role Middleware', priority: 'Medium', status: 'InProgress', projectId: project1.id, assigneeId: member2.id },
        { title: 'Add Project Endpoints', priority: 'Medium', status: 'InProgress', projectId: project1.id, assigneeId: member3.id },
        
        // Project 2 Tasks
        { title: 'Design Component Library', priority: 'High', status: 'Completed', projectId: project2.id, assigneeId: member1.id },
        { title: 'Build Layout Wrapper', priority: 'Medium', status: 'InProgress', projectId: project2.id, assigneeId: member2.id },
        { title: 'Integration with Auth API', priority: 'High', status: 'Todo', projectId: project2.id, assigneeId: member3.id },
        
        // Project 3 Tasks
        { title: 'User Requirements Doc', priority: 'High', status: 'Completed', projectId: project3.id, assigneeId: admin.id },
        { title: 'UI/UX Prototypes', priority: 'Medium', status: 'Completed', projectId: project3.id, assigneeId: member1.id },
        { title: 'Market Analysis', priority: 'Low', status: 'Completed', projectId: project3.id, assigneeId: member2.id },
    ];

    for (const task of tasks) {
        await prisma.task.create({ data: task });
    }

    console.log('✅ Seeding complete! Database is ready.');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
