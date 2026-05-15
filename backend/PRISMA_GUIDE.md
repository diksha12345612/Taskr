# Prisma Setup & Migration Guide for Taskr

## Schema Overview

Your Taskr Prisma schema is now configured with:

- **4 Models**: User, Project, Task (with enums for type-safety)
- **4 Enums**: UserRole, ProjectStatus, TaskStatus, TaskPriority
- **Relationships**: User → Task, Project → Task
- **Database**: PostgreSQL with proper indexing

## Quick Start

### 1. Initialize Prisma Client

```bash
# Generate Prisma Client
npm run prisma:generate

# Or manually
npx prisma generate
```

### 2. Create Initial Migration

```bash
# Create and apply migration in one step
npm run migrate

# You'll be prompted to name the migration (e.g., "init" or "create_initial_schema")
```

### 3. Verify Database Setup

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio

# Runs at http://localhost:5555
```

## Prisma Client Setup

### Import & Use in Controllers

```javascript
import prisma from '../config/database.js';

// Example: Create user
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPassword,
    role: 'Member'
  }
});

// Example: Create task
const task = await prisma.task.create({
  data: {
    title: 'Complete API',
    description: 'Build REST API endpoints',
    priority: 'High',
    status: 'InProgress',
    dueDate: new Date('2026-06-15'),
    projectId: 'project-id-here',
    assigneeId: 'user-id-here'
  }
});

// Example: Query with relations
const project = await prisma.project.findUnique({
  where: { id: 'project-id' },
  include: {
    tasks: true  // Include all tasks
  }
});

// Example: Update task status
const updatedTask = await prisma.task.update({
  where: { id: 'task-id' },
  data: { status: 'Completed' }
});
```

## Database Schema Structure

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

## Enum Values Reference

### UserRole
- `Admin` - Full access to all features
- `Member` - Limited access to assigned tasks

### ProjectStatus
- `Active` - Currently in progress
- `Review` - Under review
- `Hold` - Temporarily paused

### TaskStatus
- `Todo` - Not started
- `InProgress` - Currently being worked on
- `Completed` - Finished

### TaskPriority
- `High` - Urgent, requires immediate attention
- `Medium` - Standard priority
- `Low` - Nice to have, can be deferred

## Common Prisma Commands

```bash
# Generate Prisma Client (run after schema changes)
npm run prisma:generate

# Create and apply migration interactively
npm run migrate

# Apply pending migrations (production)
npm run migrate:prod

# Push schema changes directly (dev only)
npm run db:push

# Reset database to clean state (dev only - WARNING: deletes all data)
npm run db:reset

# Open visual database browser
npx prisma studio

# View migration history
npx prisma migrate status

# Create empty migration for manual SQL
npx prisma migrate dev --create-only
```

## Relationships

### One-to-Many: User → Task (Assignee)
```javascript
// Get all tasks assigned to a user
const userWithTasks = await prisma.user.findUnique({
  where: { id: userId },
  include: { assignedTasks: true }
});

// Get assignee info for a task
const task = await prisma.task.findUnique({
  where: { id: taskId },
  include: { assignee: true }
});
```

### One-to-Many: Project → Task
```javascript
// Get all tasks in a project
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: { tasks: true }
});

// Get project info for a task
const task = await prisma.task.findUnique({
  where: { id: taskId },
  include: { project: true }
});
```

## Database Delete Behavior

### Cascade Delete
When a **Project** is deleted, all its **Tasks** are automatically deleted.

```javascript
// This deletes the project and all associated tasks
await prisma.project.delete({
  where: { id: projectId }
});
```

### Set NULL on Delete
When a **User** is deleted, their **assigned Tasks** remain but have `assigneeId` set to `NULL`.

```javascript
// User is deleted, but tasks are preserved with assigneeId = null
await prisma.user.delete({
  where: { id: userId }
});
```

## Querying Examples

### Create a New User
```javascript
const newUser = await prisma.user.create({
  data: {
    name: 'Alice Smith',
    email: 'alice@taskr.io',
    password: 'hashed_password_here',
    role: 'Admin'
  }
});
```

### Create a Project with Tasks
```javascript
const project = await prisma.project.create({
  data: {
    name: 'Website Redesign',
    description: 'Modernize company website',
    status: 'Active',
    progress: 30,
    tasks: {
      create: [
        {
          title: 'Design mockups',
          description: 'Create UI mockups',
          priority: 'High',
          status: 'InProgress',
          assigneeId: userId
        },
        {
          title: 'Implement frontend',
          description: 'Build React components',
          priority: 'High',
          status: 'Todo'
        }
      ]
    }
  }
});
```

### Find All Tasks by Status
```javascript
const completedTasks = await prisma.task.findMany({
  where: { status: 'Completed' },
  include: {
    assignee: { select: { name: true, email: true } },
    project: { select: { name: true } }
  }
});
```

### Update Multiple Tasks
```javascript
const updated = await prisma.task.updateMany({
  where: { projectId: projectId, status: 'Todo' },
  data: { status: 'InProgress' }
});
```

### Delete All Tasks in a Project
```javascript
await prisma.task.deleteMany({
  where: { projectId: projectId }
});
```

## Best Practices

### 1. Always Use Enums
```javascript
// ✅ Good - Type-safe
const task = await prisma.task.create({
  data: {
    status: 'InProgress',
    priority: 'High'
  }
});

// ❌ Avoid - String values
const task = await prisma.task.create({
  data: {
    status: 'in progress',  // Wrong case!
    priority: 'high'        // Wrong case!
  }
});
```

### 2. Select Only Needed Fields
```javascript
// ✅ Good - Only password needed
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  select: { id: true, email: true, password: true }
});

// ❌ Avoid - Fetches all fields
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

### 3. Use Include for Relations
```javascript
// ✅ Good - Get task with assignee details
const task = await prisma.task.findUnique({
  where: { id: taskId },
  include: {
    assignee: true,
    project: { select: { name: true } }
  }
});
```

### 4. Handle Null Values
```javascript
// ✅ Good - Check for null assignee
const task = await prisma.task.findUnique({
  where: { id: taskId },
  include: { assignee: true }
});

if (task.assignee === null) {
  console.log('Task has no assignee');
}
```

### 5. Error Handling
```javascript
// ✅ Good - Handle Prisma errors
try {
  await prisma.user.create({
    data: { email: 'existing@example.com', password: 'pwd', name: 'User' }
  });
} catch (error) {
  if (error.code === 'P2002') {
    console.log('Email already exists');
  } else {
    console.error('Database error:', error);
  }
}
```

## Prisma Error Codes

| Code | Meaning |
|------|---------|
| P2002 | Unique constraint violation |
| P2025 | Record not found |
| P2003 | Foreign key constraint violation |
| P2014 | Required relation violation |
| P2024 | Timed out fetching a new connection |

## Troubleshooting

### Schema Changes Don't Apply
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Then run migration
npm run migrate
```

### Database Connection Issues
```bash
# Check DATABASE_URL in .env
echo $DATABASE_URL  # (Linux/Mac)
echo %DATABASE_URL%  # (Windows)

# Test connection
npx prisma db execute --stdin <<< "SELECT NOW();"
```

### Can't Find Prisma Client
```bash
# Regenerate client
npx prisma generate

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Migration Conflicts
```bash
# Reset and start fresh (dev only!)
npm run db:reset
```

## Next Steps

1. **Run migrations**: `npm run migrate`
2. **Generate client**: `npm run prisma:generate`
3. **Verify setup**: `npx prisma studio`
4. **Start building**: Use Prisma queries in controllers

See `BACKEND_ARCHITECTURE.md` for how to use Prisma in controllers.

---

**Schema Version:** 1.0.0  
**Database:** PostgreSQL  
**ORM:** Prisma 5.8.0+
