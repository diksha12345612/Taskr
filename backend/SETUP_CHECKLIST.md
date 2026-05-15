# Taskr Prisma - Setup Checklist

Complete this checklist to ensure your Prisma schema is properly initialized and ready for backend development.

## ✅ Pre-Setup Requirements

### Database Prerequisites
- [ ] PostgreSQL installed on your machine
- [ ] PostgreSQL running (background service active)
- [ ] Database `taskr_db` created
- [ ] User `taskr_user` created with password
- [ ] `.env` file has correct `DATABASE_URL`

**Verify Database Connection:**
```bash
psql -U taskr_user -d taskr_db -h localhost
# If successful, you'll see: taskr_db=>
# Type: \q to exit
```

### Project Prerequisites
- [ ] `backend/` directory exists
- [ ] `backend/package.json` exists with dependencies
- [ ] `backend/prisma/schema.prisma` exists
- [ ] `backend/.env` file exists with DATABASE_URL

## ✅ Step 1: Install Dependencies

- [ ] Navigate to backend directory: `cd backend`
- [ ] Install packages: `npm install`
- [ ] Verify packages installed: `npm list` (no errors)
- [ ] Check for @prisma/client in output

**Expected Output:**
```
npm list | grep prisma
@prisma/client@5.8.0
prisma@5.8.0
```

## ✅ Step 2: Generate Prisma Client

- [ ] Run: `npm run prisma:generate`
- [ ] Confirm output: `✔ Generated Prisma Client`
- [ ] Check: `node_modules/@prisma/client/` folder created

**Expected Output:**
```
✔ Generated Prisma Client (5.8.0) in 1.23s
You can now start using Prisma Client in your code:
  import { PrismaClient } from '@prisma/client'
  const prisma = new PrismaClient()
```

## ✅ Step 3: Create Initial Migration

- [ ] Run: `npm run migrate`
- [ ] When prompted for migration name, enter: `init`
- [ ] Confirm migration created: `prisma/migrations/` folder exists
- [ ] Verify migration applied: "All migrations have been applied"

**Expected Output:**
```
✔ Environment variables loaded from .env
✔ Your database has been successfully migrated to `20260515120000_init`.
```

## ✅ Step 4: Verify Database Schema

- [ ] Run: `npx prisma studio`
- [ ] Browser opens at: `http://localhost:5555`
- [ ] Check tables exist:
  - [ ] `users` table present
  - [ ] `projects` table present
  - [ ] `tasks` table present
- [ ] Verify columns in each table:
  - Users: `id`, `name`, `email`, `password`, `role`, `createdAt`
  - Projects: `id`, `name`, `description`, `status`, `progress`, `createdAt`
  - Tasks: `id`, `title`, `description`, `priority`, `status`, `dueDate`, `projectId`, `assigneeId`, `createdAt`

## ✅ Step 5: Verify Indexes

In Prisma Studio:
- [ ] Check `users` table:
  - [ ] Index on `email` exists
  - [ ] Index on `role` exists
- [ ] Check `projects` table:
  - [ ] Index on `status` exists
  - [ ] Index on `progress` exists
- [ ] Check `tasks` table:
  - [ ] Index on `projectId` exists
  - [ ] Index on `assigneeId` exists
  - [ ] Index on `status` exists
  - [ ] Index on `priority` exists
  - [ ] Index on `dueDate` exists

## ✅ Step 6: Test Prisma Client

Create a test file: `backend/test-prisma.js`

```javascript
import prisma from './src/config/database.js';

async function test() {
  try {
    // Create a user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'hashed_password_here',
        role: 'Member'
      }
    });
    console.log('✓ User created:', user);

    // Create a project
    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'Testing Prisma setup',
        status: 'Active',
        progress: 0
      }
    });
    console.log('✓ Project created:', project);

    // Create a task
    const task = await prisma.task.create({
      data: {
        title: 'Test Task',
        description: 'Testing task creation',
        priority: 'High',
        status: 'InProgress',
        projectId: project.id,
        assigneeId: user.id
      }
    });
    console.log('✓ Task created:', task);

    // Query relationships
    const userWithTasks = await prisma.user.findUnique({
      where: { id: user.id },
      include: { assignedTasks: true }
    });
    console.log('✓ User with tasks:', userWithTasks);

    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

test();
```

Run the test:
```bash
node test-prisma.js
```

- [ ] Test runs without errors
- [ ] User created successfully
- [ ] Project created successfully
- [ ] Task created successfully
- [ ] Relationships work correctly

**Expected Output:**
```
✓ User created: { id: '...', name: 'Test User', email: '...', ... }
✓ Project created: { id: '...', name: 'Test Project', ... }
✓ Task created: { id: '...', title: 'Test Task', ... }
✓ User with tasks: { id: '...', assignedTasks: [ { id: '...', ... } ] }
✅ All tests passed!
```

Then delete the test file:
```bash
rm test-prisma.js
```

## ✅ Step 7: Schema Validation

- [ ] Open: `backend/prisma/schema.prisma`
- [ ] Verify enums defined:
  - [ ] `enum UserRole` with Admin, Member
  - [ ] `enum ProjectStatus` with Active, Review, Hold
  - [ ] `enum TaskStatus` with Todo, InProgress, Completed
  - [ ] `enum TaskPriority` with High, Medium, Low
- [ ] Verify User model:
  - [ ] `id` with `@id @default(cuid())`
  - [ ] `email` with `@unique`
  - [ ] `role` with `UserRole` enum
  - [ ] `assignedTasks` relation
- [ ] Verify Project model:
  - [ ] `progress` with SmallInt type
  - [ ] `status` with ProjectStatus enum
  - [ ] `tasks` relation
- [ ] Verify Task model:
  - [ ] All required fields present
  - [ ] Foreign keys to Project and User
  - [ ] Proper cascade/setNull delete behavior

## ✅ Step 8: Documentation Review

- [ ] Read: `backend/PRISMA_COMPLETE_GUIDE.md`
- [ ] Read: `backend/PRISMA_SCHEMA_REFERENCE.md`
- [ ] Read: `backend/MIGRATION_GUIDE.md`
- [ ] Understand: How to import prisma in controllers
- [ ] Review: Example queries in documentation

## ✅ Step 9: Ready for Implementation

Before starting to build controllers:

- [ ] Prisma Client generated successfully
- [ ] Database migrated without errors
- [ ] All tables created in PostgreSQL
- [ ] Test queries ran successfully
- [ ] Schema matches requirements
- [ ] Documentation reviewed
- [ ] Can import: `import prisma from '../config/database.js';`

## ✅ Troubleshooting Checklist

If something doesn't work:

### Issue: "Cannot find module @prisma/client"
- [ ] Run: `npm run prisma:generate`
- [ ] Run: `npm install`
- [ ] Check: `node_modules/@prisma/client` exists

### Issue: "Database connection failed"
- [ ] Verify: PostgreSQL running
- [ ] Check: `psql -U taskr_user -d taskr_db`
- [ ] Verify: DATABASE_URL in `.env` is correct
- [ ] Format: `postgresql://user:password@localhost:5432/database`

### Issue: "Migration already exists"
- [ ] Run: `npm run migrate`
- [ ] Confirms existing migration

### Issue: "Tables not created"
- [ ] Check: `npx prisma migrate status`
- [ ] Run: `npm run migrate` to apply migrations

### Issue: "Schema doesn't match database"
- [ ] Run: `npm run prisma:generate`
- [ ] Run: `npm run migrate`

### Issue: "Prisma Studio won't open"
- [ ] Verify: Port 5555 is available
- [ ] Kill: Any process using port 5555
- [ ] Retry: `npx prisma studio`

## ✅ Commands Reference

Keep these commands handy during development:

```bash
# Setup (one time)
npm run prisma:generate      # Generate Prisma Client
npm run migrate              # Create database tables

# After schema changes
npm run prisma:generate      # Regenerate client
npm run migrate              # Create migration

# Development tools
npx prisma studio          # Visual database browser (http://localhost:5555)
npm run db:push            # Push schema directly (dev only)
npm run db:reset           # Start with fresh database (dev only)

# Production
npm run migrate:prod       # Apply migrations safely

# Debugging
npx prisma migrate status  # Check migration status
npx prisma validate       # Validate schema.prisma
```

## ✅ File Locations

After setup, you should have:

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── .env
│   ├── .gitignore
│   └── migrations/
│       ├── migration_lock.toml
│       └── 20250515_init/
│           └── migration.sql
├── src/config/
│   └── database.js        (Already configured)
├── node_modules/
│   └── @prisma/          (After npm install)
├── .env
└── package.json
```

## ✅ Success Criteria

Your setup is complete when:

✅ `npm run prisma:generate` shows "Generated Prisma Client"
✅ `npm run migrate` shows "successfully migrated"
✅ `npx prisma studio` opens and shows 3 tables
✅ Test file creates users, projects, and tasks
✅ All tables have correct schema
✅ Relationships work properly
✅ Can import prisma in code
✅ Documentation is understood

## 🚀 Next Phase

Once setup is complete, you can:

1. **Implement Auth Controller** - Use prisma in `src/controllers/auth.js`
2. **Build Auth Routes** - Add user registration/login endpoints
3. **Create Project Routes** - Build CRUD for projects
4. **Create Task Routes** - Build CRUD for tasks
5. **Connect Frontend** - Wire frontend to backend API

## 📝 Setup Completion Date

- [ ] Date setup completed: ___________
- [ ] Time spent: ___________
- [ ] Any issues encountered: ___________

---

**Prisma Setup Checklist v1.0**
**For Taskr Team Management Application**
**PostgreSQL Database**
