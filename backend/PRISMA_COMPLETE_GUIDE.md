# Taskr Prisma Schema - Complete Implementation Guide

## 🎯 What You Now Have

Your Taskr backend is configured with a complete, production-ready Prisma schema consisting of:

```
✅ 3 Data Models (User, Project, Task)
✅ 4 Type-Safe Enums (UserRole, ProjectStatus, TaskStatus, TaskPriority)
✅ Proper One-to-Many Relationships
✅ Automatic Timestamps
✅ Performance Indexes
✅ Cascade Deletes
✅ PostgreSQL Configuration
```

## 📊 Database Architecture

```
┌──────────────┐
│    User      │
├──────────────┤
│ id (PK)      │
│ name         │
│ email (U)    │
│ password     │
│ role (enum)  │
│ createdAt    │
└──────┬───────┘
       │ (1) assigns (Many)
       │
       ↓
┌──────────────────┐
│     Task         │
├──────────────────┤
│ id (PK)          │
│ title            │
│ description      │
│ priority (enum)  │
│ status (enum)    │
│ dueDate          │
│ projectId (FK)   │──┐
│ assigneeId (FK)  │  │
│ createdAt        │  │
└──────────────────┘  │
                      │ (Many)
                      │ belongs to (1)
                      │
                      ↓
            ┌──────────────────┐
            │    Project       │
            ├──────────────────┤
            │ id (PK)          │
            │ name             │
            │ description      │
            │ status (enum)    │
            │ progress (0-100) │
            │ createdAt        │
            └──────────────────┘
```

## 📝 Schema Details

### User Model
```prisma
model User {
  id        String   @id @default(cuid())  // Unique ID
  name      String   @db.VarChar(255)      // User's name
  email     String   @unique @db.VarChar(255)  // Unique email
  password  String   @db.Text              // Hashed password
  role      UserRole @default(Member)      // Admin or Member
  
  // Relations
  assignedTasks Task[] @relation("assignee")
  
  createdAt DateTime @default(now())       // Auto timestamp
  
  // Indexes for performance
  @@index([email])
  @@index([role])
}
```

### Project Model
```prisma
model Project {
  id          String        @id @default(cuid())  // Unique ID
  name        String        @db.VarChar(255)      // Project name
  description String?       @db.Text              // Description (optional)
  status      ProjectStatus @default(Active)      // Active/Review/Hold
  progress    Int           @default(0) @db.SmallInt  // 0-100 percentage
  
  // Relations
  tasks Task[]
  
  createdAt DateTime @default(now())       // Auto timestamp
  
  // Indexes
  @@index([status])
  @@index([progress])
}
```

### Task Model
```prisma
model Task {
  id          String       @id @default(cuid())  // Unique ID
  title       String       @db.VarChar(255)      // Task name
  description String?      @db.Text              // Details (optional)
  priority    TaskPriority @default(Medium)      // High/Medium/Low
  status      TaskStatus   @default(Todo)        // Todo/InProgress/Completed
  dueDate     DateTime?    @db.Date              // Deadline (optional)
  
  // Foreign Keys and Relations
  projectId  String
  project    Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  assigneeId String?
  assignee   User? @relation("assignee", fields: [assigneeId], references: [id], onDelete: SetNull)
  
  createdAt DateTime @default(now())       // Auto timestamp
  
  // Indexes
  @@index([projectId])
  @@index([assigneeId])
  @@index([status])
  @@index([priority])
  @@index([dueDate])
}
```

### Enums
```prisma
enum UserRole {
  Admin   // Full access
  Member  // Limited access
}

enum ProjectStatus {
  Active  // In progress
  Review  // Under review
  Hold    // Paused
}

enum TaskStatus {
  Todo        // Not started
  InProgress  // Being worked on
  Completed   // Finished
}

enum TaskPriority {
  High    // Urgent
  Medium  // Standard
  Low     // Nice to have
}
```

## 🚀 Getting Started (Quick Start)

### 1. Generate Prisma Client
```bash
cd backend
npm run prisma:generate
```

**What this does:**
- Creates `@prisma/client` TypeScript types
- Enables IDE autocomplete
- Validates schema

### 2. Create Initial Migration
```bash
npm run migrate
```

**What this does:**
- Generates SQL migration file
- Creates all tables in PostgreSQL
- Records migration in database

**When prompted for migration name, type:** `init` or `initial_schema`

### 3. Verify Setup
```bash
npx prisma studio
```

**What this shows:**
- Visual database browser
- All tables created
- Data viewer for each table
- Opens at http://localhost:5555

## 📚 File Locations

```
backend/
├── prisma/
│   ├── schema.prisma           ← Your database schema (READ & UNDERSTAND THIS)
│   ├── migrations/             ← Auto-generated migration files
│   │   └── 20260515_init/
│   │       └── migration.sql   ← Generated SQL
│   └── .gitignore             ← Ignores sensitive files
│
├── src/config/
│   └── database.js            ← Prisma Client initialized (READY TO USE)
│
└── Documentation:
    ├── PRISMA_GUIDE.md                ← Comprehensive guide (READ THIS FIRST)
    ├── PRISMA_SCHEMA_REFERENCE.md     ← Schema quick reference
    ├── MIGRATION_GUIDE.md              ← Migration details
    ├── BACKEND_ARCHITECTURE.md         ← Where to use Prisma
    └── (this file)
```

## 🔧 Essential Commands

```bash
# One-time setup
npm run prisma:generate        # Generate Prisma Client
npm run migrate                # Create database tables

# After modifying schema.prisma
npm run prisma:generate        # Regenerate client
npm run migrate                # Create migration

# Development utilities
npx prisma studio             # Visual database browser
npm run db:push               # Push schema changes directly (dev only)
npm run db:reset              # Start with fresh database (dev only)

# Production
npm run migrate:prod           # Apply migrations safely
```

## 💻 Using Prisma in Your Code

### Import Prisma in Controllers
```javascript
import prisma from '../config/database.js';

// Now use prisma to query your database
```

### Create Records
```javascript
// Create a user
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    role: 'Member'  // Uses UserRole enum
  }
});

// Create a project
const project = await prisma.project.create({
  data: {
    name: 'Website Redesign',
    description: 'Modernize the website',
    status: 'Active',  // Uses ProjectStatus enum
    progress: 0
  }
});

// Create a task
const task = await prisma.task.create({
  data: {
    title: 'Design Homepage',
    description: 'Create UI mockups',
    priority: 'High',      // Uses TaskPriority enum
    status: 'InProgress',  // Uses TaskStatus enum
    dueDate: new Date('2026-06-15'),
    projectId: project.id,
    assigneeId: user.id
  }
});
```

### Read Records
```javascript
// Find user by email
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
});

// Get project with all tasks
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: { tasks: true }
});

// Get task with assignee and project details
const task = await prisma.task.findUnique({
  where: { id: taskId },
  include: {
    assignee: true,
    project: true
  }
});

// Get all tasks assigned to a user
const userTasks = await prisma.task.findMany({
  where: { assigneeId: userId },
  include: { project: true }
});

// Get all high priority tasks
const urgentTasks = await prisma.task.findMany({
  where: { priority: 'High' },
  include: { assignee: true, project: true }
});
```

### Update Records
```javascript
// Update task status
await prisma.task.update({
  where: { id: taskId },
  data: { status: 'Completed' }
});

// Update project progress
await prisma.project.update({
  where: { id: projectId },
  data: { progress: 50 }
});

// Update multiple tasks
await prisma.task.updateMany({
  where: { projectId, status: 'Todo' },
  data: { status: 'InProgress' }
});
```

### Delete Records
```javascript
// Delete a task
await prisma.task.delete({
  where: { id: taskId }
});

// Delete a project (cascades to all tasks)
await prisma.project.delete({
  where: { id: projectId }
});

// Delete all tasks in a project
await prisma.task.deleteMany({
  where: { projectId }
});
```

## 🔐 Relationships Explained

### User → Task (One-to-Many)
```javascript
// Get all tasks for a user
const userWithTasks = await prisma.user.findUnique({
  where: { id: userId },
  include: { assignedTasks: true }
});

// Returns:
// {
//   id: "user123",
//   name: "John Doe",
//   email: "john@example.com",
//   assignedTasks: [
//     { id: "task1", title: "Task 1", ... },
//     { id: "task2", title: "Task 2", ... }
//   ]
// }
```

### Project → Task (One-to-Many)
```javascript
// Get all tasks in a project
const projectWithTasks = await prisma.project.findUnique({
  where: { id: projectId },
  include: { tasks: true }
});

// Returns:
// {
//   id: "proj123",
//   name: "Website Redesign",
//   tasks: [
//     { id: "task1", title: "Task 1", ... },
//     { id: "task2", title: "Task 2", ... }
//   ]
// }
```

## ⚠️ Important Delete Behavior

### Cascade Delete: Project → Task
When you delete a project, all its tasks are automatically deleted.
```javascript
// This deletes the project AND all its tasks
await prisma.project.delete({ where: { id: projectId } });
```

### Set NULL on Delete: User → Task
When you delete a user, their assigned tasks remain but lose the assignee.
```javascript
// This deletes the user, but tasks remain with assigneeId = null
await prisma.user.delete({ where: { id: userId } });

// Tasks now show as unassigned
const tasks = await prisma.task.findMany({
  where: { assigneeId: null }
});
```

## 📋 Database Schema SQL Generated

Your schema generates this PostgreSQL structure:

```sql
-- Users Table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'Member',
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Active',
  progress SMALLINT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Todo',
  dueDate DATE,
  projectId TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assigneeId TEXT REFERENCES users(id) ON DELETE SET NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_progress ON projects(progress);
CREATE INDEX idx_tasks_projectId ON tasks(projectId);
CREATE INDEX idx_tasks_assigneeId ON tasks(assigneeId);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_dueDate ON tasks(dueDate);
```

## ✨ Key Features

✅ **Type-Safe Enums** - No more string validation errors  
✅ **Automatic Timestamps** - `createdAt` managed by database  
✅ **Performance Indexes** - All queryable fields indexed  
✅ **Cascade Deletes** - Clean up related data  
✅ **Proper Relationships** - One-to-many correctly structured  
✅ **Optional Fields** - Description and dueDate can be null  
✅ **Modern PostgreSQL** - Uses latest features  
✅ **Production Ready** - Scalable and maintainable  

## 🎓 Learning Path

1. **Read**: `PRISMA_GUIDE.md` - Learn Prisma fundamentals
2. **Reference**: `PRISMA_SCHEMA_REFERENCE.md` - Quick lookup
3. **Understand**: `MIGRATION_GUIDE.md` - Database versioning
4. **Implement**: In controllers using examples above
5. **Deploy**: Using `npm run migrate:prod` commands

## 📊 Quick Data Flow

```
Your Code (Controller)
    ↓
import prisma from '../config/database.js'
    ↓
prisma.user.create({ data: { ... } })
    ↓
Prisma Client (validates data)
    ↓
PostgreSQL (stores data)
    ↓
Prisma returns JavaScript object
    ↓
Your controller returns JSON response
    ↓
Frontend receives data
```

## 🚀 Next Steps

### Immediate (Today)
1. Run `npm run prisma:generate`
2. Run `npm run migrate`
3. Run `npx prisma studio`
4. Verify all 3 tables created

### Soon (Building Controllers)
1. Import prisma in your controller files
2. Use examples above to query data
3. Test queries in your API endpoints
4. Use Prisma Studio to verify data

### Later (Extending Schema)
1. Modify `prisma/schema.prisma` to add fields/models
2. Run `npm run migrate` to create migration
3. Repeat as needed

## 📞 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module @prisma/client" | Run `npm run prisma:generate` |
| "Database connection failed" | Check DATABASE_URL in .env |
| "Migration already exists" | Run `npm run migrate` to apply it |
| "Prisma Client out of sync" | Run `npm run prisma:generate` |
| "Tables not created" | Run `npm run migrate` |

## 📖 Documentation Files

| File | When to Read |
|------|--------------|
| **PRISMA_GUIDE.md** | Complete Prisma tutorial |
| **PRISMA_SCHEMA_REFERENCE.md** | Quick schema lookup |
| **MIGRATION_GUIDE.md** | Database version control |
| **BACKEND_ARCHITECTURE.md** | Where to use Prisma |
| **This file** | Overview of everything |

## ✅ Verification Checklist

Before using Prisma in your code:

- [ ] Schema file exists: `prisma/schema.prisma`
- [ ] Config file ready: `src/config/database.js`
- [ ] Run: `npm run prisma:generate`
- [ ] Run: `npm run migrate`
- [ ] Verify: `npx prisma studio` shows 3 tables
- [ ] Check: All fields match your requirements

## 🎯 You're Ready!

Your Prisma schema is complete and ready to use. Start building your API endpoints using the examples above!

---

**Prisma Status:** ✅ Complete  
**Schema Version:** 1.0.0  
**Database:** PostgreSQL  
**Models:** 3 (User, Project, Task)  
**Enums:** 4 (UserRole, ProjectStatus, TaskStatus, TaskPriority)  

Ready to implement your first API endpoint!
