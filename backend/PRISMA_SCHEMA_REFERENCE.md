# Taskr Prisma Schema Reference

## Schema Summary

Your Taskr database is structured with **3 models** and **4 enums** for type-safe operations.

```
User (Member or Admin)
  ↓ assigns
  ↓
Task (assigned to User, belongs to Project)
  ↓
Project (contains Tasks)
```

## Data Models

### User Model
```javascript
{
  id: String         // Auto-generated unique ID
  name: String       // User's full name
  email: String      // Unique email address
  password: String   // Hashed password
  role: UserRole     // 'Admin' or 'Member'
  assignedTasks: Task[]  // Tasks assigned to this user
  createdAt: DateTime    // Account creation timestamp
}
```

### Project Model
```javascript
{
  id: String          // Auto-generated unique ID
  name: String        // Project name
  description: String // Project details (optional)
  status: ProjectStatus  // 'Active', 'Review', or 'Hold'
  progress: Int       // Completion percentage (0-100)
  tasks: Task[]       // All tasks in this project
  createdAt: DateTime // Creation timestamp
}
```

### Task Model
```javascript
{
  id: String         // Auto-generated unique ID
  title: String      // Task name
  description: String // Task details (optional)
  priority: TaskPriority  // 'High', 'Medium', or 'Low'
  status: TaskStatus     // 'Todo', 'InProgress', or 'Completed'
  dueDate: DateTime  // Deadline (optional)
  projectId: String  // FK - Which project this belongs to
  project: Project   // Related project object
  assigneeId: String // FK - Who this task is assigned to (optional)
  assignee: User     // Related user object (can be null)
  createdAt: DateTime // Creation timestamp
}
```

## Enums

### UserRole
```
Admin   → Full permissions
Member  → Limited permissions
```

### ProjectStatus
```
Active  → Currently in progress
Review  → Under review
Hold    → Temporarily paused
```

### TaskStatus
```
Todo        → Not started
InProgress  → Currently being worked on
Completed   → Finished
```

### TaskPriority
```
High    → Urgent
Medium  → Standard
Low     → Nice to have
```

## Essential Prisma Commands

```bash
# Initial setup (one time)
npm run prisma:generate        # Generate Prisma Client
npm run migrate                # Create database tables

# After schema changes
npm run prisma:generate        # Regenerate client
npm run migrate                # Apply migrations

# Development utilities
npx prisma studio             # Visual database browser
npm run db:push               # Push schema directly (dev only)
npm run db:reset              # Start fresh (dev only - deletes all data)

# Production
npm run migrate:prod           # Apply migrations safely
```

## Basic Usage Examples

### Create User
```javascript
import prisma from '../config/database.js';

const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPassword,
    role: 'Member'
  }
});
```

### Create Project
```javascript
const project = await prisma.project.create({
  data: {
    name: 'Website Redesign',
    description: 'Modernize the company website',
    status: 'Active',
    progress: 0
  }
});
```

### Create Task
```javascript
const task = await prisma.task.create({
  data: {
    title: 'Design Homepage',
    description: 'Create UI mockups for homepage',
    priority: 'High',
    status: 'InProgress',
    dueDate: new Date('2026-06-15'),
    projectId: projectId,
    assigneeId: userId
  }
});
```

### Get User with Tasks
```javascript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { assignedTasks: true }
});
```

### Get Project with Tasks
```javascript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: { tasks: true }
});
```

### Get Task with Relations
```javascript
const task = await prisma.task.findUnique({
  where: { id: taskId },
  include: {
    assignee: true,
    project: true
  }
});
```

### Update Task Status
```javascript
const updated = await prisma.task.update({
  where: { id: taskId },
  data: { status: 'Completed' }
});
```

### Find Tasks by Status
```javascript
const inProgressTasks = await prisma.task.findMany({
  where: { status: 'InProgress' },
  include: { assignee: true, project: true }
});
```

### Delete Project (cascades to tasks)
```javascript
await prisma.project.delete({
  where: { id: projectId }
});
// All tasks in this project are automatically deleted
```

## Relationship Behavior

### User → Task (One-to-Many)
- One user can have many tasks assigned
- When user is deleted, tasks remain but assigneeId becomes NULL
- Optional relationship (task can have no assignee)

### Project → Task (One-to-Many)
- One project can have many tasks
- When project is deleted, all its tasks are deleted
- Required relationship (task must belong to a project)

## Database Indexes

```
users.email       → Fast email lookups
users.role        → Fast role filtering
projects.status   → Fast status filtering
projects.progress → Fast progress filtering
tasks.projectId   → Fast project lookups
tasks.assigneeId  → Fast assignee lookups
tasks.status      → Fast status filtering
tasks.priority    → Fast priority filtering
tasks.dueDate     → Fast date filtering
```

## Validation Approach

Use Prisma enums instead of string validation:

```javascript
// ✅ Correct - Database enforces the enum
await prisma.task.create({
  data: {
    status: 'InProgress',  // Must match TaskStatus enum
    priority: 'High'       // Must match TaskPriority enum
  }
});

// ❌ Wrong - Will fail
await prisma.task.create({
  data: {
    status: 'in-progress',  // Case matters!
    priority: 'urgent'      // Not in enum
  }
});
```

## Migration Workflow

```bash
# 1. Modify prisma/schema.prisma
# (Already done - schema is ready to use)

# 2. Generate Prisma Client (first time only)
npm run prisma:generate

# 3. Create migration
npm run migrate

# 4. Name the migration (e.g., "init" for initial)
# Enter: init

# 5. Verify in Prisma Studio
npx prisma studio
```

## Key Features

✅ **Type-safe enums** - No more string validation  
✅ **Automatic timestamps** - createdAt managed by database  
✅ **Proper relationships** - One-to-many correctly configured  
✅ **Cascade deletes** - Projects remove their tasks  
✅ **Optional fields** - Description and dueDate are optional  
✅ **Indexes** - All queryable fields indexed for performance  
✅ **Database mapping** - `@@map()` for custom table names  
✅ **Constraints** - Unique emails, foreign keys enforced  

## File Locations

- **Schema**: `prisma/schema.prisma`
- **Prisma Config**: `prisma/.env` (uses DATABASE_URL from root .env)
- **Client**: Auto-generated in node_modules (don't edit manually)
- **Migrations**: `prisma/migrations/` (auto-generated)

## Next Steps

1. Run `npm run prisma:generate` to generate Prisma Client
2. Run `npm run migrate` to create database tables
3. Open `npx prisma studio` to verify database
4. Import `prisma` in controllers: `import prisma from '../config/database.js';`
5. Use Prisma queries in your API endpoints

See `PRISMA_GUIDE.md` for detailed examples and troubleshooting.

---

**Schema Status:** ✅ Complete and Ready to Use  
**Type Safety:** ✅ All enums configured  
**Relationships:** ✅ Properly mapped  
**Timestamps:** ✅ Automatic createdAt
