# Prisma Setup Verification Guide

## 🎯 Verify Your Prisma Schema is Complete

This guide helps you verify that your Prisma setup is 100% ready for backend development.

## Phase 1: Pre-Setup Verification

### Check PostgreSQL Connection

```bash
# Windows PowerShell
$env:PGPASSWORD='taskr_password'; psql -U taskr_user -h localhost -d taskr_db -c "SELECT NOW();"

# macOS/Linux
PGPASSWORD=taskr_password psql -U taskr_user -h localhost -d taskr_db -c "SELECT NOW();"
```

✅ **Success**: Shows current timestamp
❌ **Failure**: Connection error - PostgreSQL not running or wrong credentials

### Verify Environment File

```bash
# Check .env exists
cat backend/.env

# Should contain:
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://taskr_user:taskr_password@localhost:5432/taskr_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_env_min_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
API_PREFIX=/api
```

## Phase 2: Install Dependencies

### Install Node Packages

```bash
cd backend
npm install
```

✅ **Success Output**:
```
added 200 packages in 45s
```

### Verify Prisma Package

```bash
npm list prisma @prisma/client
```

✅ **Success Output**:
```
├── @prisma/client@5.8.0
├── prisma@5.8.0
└── (other dependencies)
```

## Phase 3: Generate Prisma Client

### Generate Client

```bash
npm run prisma:generate
```

✅ **Success Output**:
```
✔ Generated Prisma Client (5.8.0) in 1.23s

You can now start using Prisma Client in your code:
  import { PrismaClient } from '@prisma/client'
  const prisma = new PrismaClient()
```

### Verify Generated Files

```bash
# Check if Prisma client generated
ls node_modules/@prisma/client/index.d.ts

# Check if schema file exists
ls prisma/schema.prisma
```

✅ **Success**: Both files exist and are accessible

## Phase 4: Create Initial Migration

### Run Migration

```bash
npm run migrate
```

You'll see:
```
✔ Environment variables loaded from .env
Enter a name for the new migration: › init
```

Type `init` and press Enter.

✅ **Success Output**:
```
✔ Prisma Migrate created the following migration:

  migrations/20250515120000_init/

✔ Your database has been successfully migrated to `20250515120000_init`.
```

### Verify Migration Created

```bash
# List migrations
ls -la prisma/migrations/

# Should show:
# 20250515120000_init/
# migration_lock.toml
```

✅ **Success**: Both migration folder and lock file exist

### Check Migration SQL

```bash
# View generated SQL
cat prisma/migrations/*/migration.sql

# Should contain:
# - CREATE TABLE "users"
# - CREATE TABLE "projects"  
# - CREATE TABLE "tasks"
# - CREATE INDEX statements
```

✅ **Success**: All tables and indexes in SQL file

## Phase 5: Verify Database Tables

### Using Prisma Studio

```bash
# Open visual database browser
npx prisma studio
```

Browser opens at: `http://localhost:5555`

**Verify you see:**
- [ ] `users` table with columns: id, name, email, password, role, createdAt
- [ ] `projects` table with columns: id, name, description, status, progress, createdAt
- [ ] `tasks` table with columns: id, title, description, priority, status, dueDate, projectId, assigneeId, createdAt

### Using psql

```bash
# Connect to database
PGPASSWORD=taskr_password psql -U taskr_user -h localhost taskr_db

# List tables
\dt

# Should show:
#          List of relations
#  Schema | Name     | Type  | Owner
# --------+----------+-------+----------
#  public | projects | table | taskr_user
#  public | tasks    | table | taskr_user
#  public | users    | table | taskr_user
```

### Check Table Schema

```bash
# Within psql session
\d users

# Should show all columns:
#                 Table "public.users"
#   Column  |       Type        | Collation | Nullable | Default
# ----------+-------------------+-----------+----------+---------
#  id       | text              |           | not null |
#  name     | character varying |           | not null |
#  email    | character varying |           | not null |
#  password | text              |           | not null |
#  role     | text              |           | not null | 'Member'::text
#  createdAt| timestamp(3)      |           | not null | now()

# Indexes:
#     "users_pkey" PRIMARY KEY, btree (id)
#     "users_email_key" UNIQUE, btree (email)
#     "idx_users_email" btree (email)
#     "idx_users_role" btree (role)
```

✅ **Success**: All columns and indexes present

### Verify Relationships

```bash
# Within psql session
\d tasks

# Should show foreign keys:
# Foreign-key constraints:
#     "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"(id) ON DELETE SET NULL
#     "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"(id) ON DELETE CASCADE
```

✅ **Success**: Cascade and SetNull relationships configured

## Phase 6: Test Prisma Client

### Create Test File

Create: `backend/verify-prisma.js`

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyPrisma() {
  console.log('\n🧪 Verifying Prisma Setup...\n');

  try {
    // 1. Test connection
    console.log('1️⃣  Testing database connection...');
    await prisma.$queryRaw`SELECT NOW()`;
    console.log('   ✅ Database connection successful\n');

    // 2. Create user
    console.log('2️⃣  Testing user creation...');
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'hashed_password_example',
        role: 'Member'
      }
    });
    console.log(`   ✅ User created: ${user.id}\n`);

    // 3. Create project
    console.log('3️⃣  Testing project creation...');
    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'Verifying Prisma setup',
        status: 'Active',
        progress: 0
      }
    });
    console.log(`   ✅ Project created: ${project.id}\n`);

    // 4. Create task
    console.log('4️⃣  Testing task creation...');
    const task = await prisma.task.create({
      data: {
        title: 'Test Task',
        description: 'Verify Prisma relationships',
        priority: 'High',
        status: 'InProgress',
        projectId: project.id,
        assigneeId: user.id
      }
    });
    console.log(`   ✅ Task created: ${task.id}\n`);

    // 5. Test read with relations
    console.log('5️⃣  Testing relationships...');
    const fullTask = await prisma.task.findUnique({
      where: { id: task.id },
      include: {
        project: true,
        assignee: true
      }
    });
    console.log(`   ✅ Task relationships working\n`);

    // 6. Test update
    console.log('6️⃣  Testing task update...');
    await prisma.task.update({
      where: { id: task.id },
      data: { status: 'Completed' }
    });
    console.log(`   ✅ Task updated successfully\n`);

    // 7. Test query filtering
    console.log('7️⃣  Testing query filtering...');
    const completedTasks = await prisma.task.findMany({
      where: { status: 'Completed' }
    });
    console.log(`   ✅ Found ${completedTasks.length} completed task(s)\n`);

    // 8. Test deletion
    console.log('8️⃣  Testing deletion...');
    await prisma.task.delete({ where: { id: task.id } });
    await prisma.project.delete({ where: { id: project.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log(`   ✅ Records deleted successfully\n`);

    console.log('✅ ALL VERIFICATION TESTS PASSED!\n');
    console.log('Your Prisma setup is complete and ready to use.\n');

  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:\n');
    console.error(`Error: ${error.message}\n`);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPrisma();
```

### Run Verification

```bash
node verify-prisma.js
```

✅ **Success Output**:
```
🧪 Verifying Prisma Setup...

1️⃣  Testing database connection...
   ✅ Database connection successful

2️⃣  Testing user creation...
   ✅ User created: clp8x9z5z0000nf8x...

3️⃣  Testing project creation...
   ✅ Project created: clp8x9z5z0001nf8x...

4️⃣  Testing task creation...
   ✅ Task created: clp8x9z5z0002nf8x...

5️⃣  Testing relationships...
   ✅ Task relationships working

6️⃣  Testing task update...
   ✅ Task updated successfully

7️⃣  Testing query filtering...
   ✅ Found 1 completed task(s)

8️⃣  Testing deletion...
   ✅ Records deleted successfully

✅ ALL VERIFICATION TESTS PASSED!

Your Prisma setup is complete and ready to use.
```

### Clean Up Test File

```bash
rm verify-prisma.js
```

## Phase 7: Verify Schema Enums

### Check Schema File

```bash
# View schema
cat prisma/schema.prisma | grep -A 5 "enum"
```

✅ **Success**: Should see all 4 enums:
```
enum UserRole {
  Admin
  Member
}

enum ProjectStatus {
  Active
  Review
  Hold
}

enum TaskStatus {
  Todo
  InProgress
  Completed
}

enum TaskPriority {
  High
  Medium
  Low
}
```

## Phase 8: Verify Configuration

### Check Database Configuration

```bash
# View config file
cat src/config/database.js

# Should import and initialize:
# - PrismaClient from @prisma/client
# - config from ./env.js
# - Connect on startup
# - Handle graceful shutdown
```

✅ **Success**: All initialization code present

### Test Config Import

```bash
# Create quick test
node -e "import('./src/config/database.js').then(() => process.exit(0))"
```

✅ **Success**: No errors, connects to database

## Phase 9: Ready-to-Use Verification

### Verify You Can Import Prisma

Test file: `backend/test-import.js`

```javascript
import prisma from './src/config/database.js';

console.log('✅ Prisma imported successfully');
console.log('Available methods:', Object.keys(prisma).slice(0, 10).join(', '));

await prisma.$disconnect();
process.exit(0);
```

Run:
```bash
node test-import.js
```

✅ **Success Output**:
```
✅ Prisma imported successfully
Available methods: $queryRaw, $executeRaw, $connect, $disconnect, ...
```

Clean up:
```bash
rm test-import.js
```

## Complete Verification Checklist

Run through this final checklist:

```bash
# 1. Check PostgreSQL
PGPASSWORD=taskr_password psql -U taskr_user -d taskr_db -c "SELECT COUNT(*) FROM users;"

# Should return: count = 0 (no test data)

# 2. Verify Prisma Client
npm list | grep prisma

# Should show: @prisma/client@5.8.0, prisma@5.8.0

# 3. Check migrations applied
npx prisma migrate status

# Should show: "Migrations have been applied"

# 4. Open database browser
npx prisma studio
# Verify tables exist, then close

# 5. Test import
node -e "import('./src/config/database.js').then(m => console.log('✅ Ready'))"
```

## Final Verification Summary

| Component | Status | Verified |
|-----------|--------|----------|
| PostgreSQL Connection | ✅ Working | [ ] |
| Node Packages | ✅ Installed | [ ] |
| Prisma Client | ✅ Generated | [ ] |
| Database Migrated | ✅ Applied | [ ] |
| Tables Created | ✅ users, projects, tasks | [ ] |
| Relationships | ✅ Configured | [ ] |
| Enums | ✅ Defined | [ ] |
| Indexes | ✅ Created | [ ] |
| Test Queries Work | ✅ CRUD verified | [ ] |
| Import Works | ✅ No errors | [ ] |

## 🚀 Next Steps

Now that Prisma is verified:

1. **Use in Controllers** - Import prisma in `src/controllers/auth.js`
2. **Write Queries** - Use create, read, update, delete methods
3. **Build Routes** - Implement API endpoints
4. **Test API** - Use Postman or curl to test endpoints
5. **Connect Frontend** - Wire frontend to backend API

## 🔗 Documentation

For more details, see:
- `PRISMA_COMPLETE_GUIDE.md` - Full reference
- `MIGRATION_GUIDE.md` - Migration details
- `SETUP_CHECKLIST.md` - Step-by-step setup
- `PRISMA_SCHEMA_REFERENCE.md` - Quick reference

## ⚡ Quick Command Reference

```bash
# Essential commands
npm run prisma:generate    # Generate Prisma Client
npm run migrate            # Create/apply migrations
npx prisma studio         # Visual database browser
npm run db:push           # Push schema directly (dev)
npm run db:reset          # Reset database (dev only)
```

---

**Verification Status:** Ready to Begin Backend Development ✅
**Prisma Schema:** Complete and Tested
**Database:** Connected and Populated
**Next Phase:** API Implementation
