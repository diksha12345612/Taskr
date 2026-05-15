# Taskr Prisma - Quick Reference Card

Print this page and keep it at your desk! 📋

---

## 🚀 QUICK START (One Time)

```bash
cd backend
npm run prisma:generate          # Generate Prisma Client
npm run migrate                  # Create database tables
npx prisma studio              # Verify in browser (http://localhost:5555)
```

---

## 💻 USING PRISMA IN CODE

### Import
```javascript
import prisma from '../config/database.js';
```

### Create
```javascript
// Create User
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    role: 'Member'  // 'Admin' or 'Member'
  }
});

// Create Project
const project = await prisma.project.create({
  data: {
    name: 'Website Redesign',
    description: 'Optional description',
    status: 'Active',  // 'Active', 'Review', or 'Hold'
    progress: 0        // 0-100
  }
});

// Create Task
const task = await prisma.task.create({
  data: {
    title: 'Design Homepage',
    description: 'Optional description',
    priority: 'High',       // 'High', 'Medium', or 'Low'
    status: 'InProgress',   // 'Todo', 'InProgress', or 'Completed'
    dueDate: new Date('2026-06-15'),  // Optional
    projectId: project.id,            // Required
    assigneeId: user.id               // Optional
  }
});
```

### Read
```javascript
// Find by ID
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// Find by email
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
});

// Find many with filter
const tasks = await prisma.task.findMany({
  where: { status: 'InProgress' }
});

// Find with relations
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: { tasks: true }
});

const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { assignedTasks: true }
});
```

### Update
```javascript
await prisma.task.update({
  where: { id: taskId },
  data: { status: 'Completed' }
});

// Update many
await prisma.task.updateMany({
  where: { projectId: projectId, status: 'Todo' },
  data: { status: 'InProgress' }
});
```

### Delete
```javascript
await prisma.task.delete({
  where: { id: taskId }
});

// Deletes project AND all tasks (CASCADE)
await prisma.project.delete({
  where: { id: projectId }
});

// Delete user but tasks remain
await prisma.user.delete({
  where: { id: userId }
});
```

---

## 📊 ENUMS (Use These Values)

### UserRole
```
'Admin'   - Full access
'Member'  - Limited access
```

### ProjectStatus
```
'Active'   - In progress
'Review'   - Under review
'Hold'     - Paused
```

### TaskStatus
```
'Todo'         - Not started
'InProgress'   - Being worked on
'Completed'    - Finished
```

### TaskPriority
```
'High'    - Urgent
'Medium'  - Standard
'Low'     - Nice to have
```

---

## 🛠️ ESSENTIAL COMMANDS

```bash
# One-time setup
npm run prisma:generate        # Generate client
npm run migrate                # Create database

# After schema changes
npm run prisma:generate
npm run migrate

# Development
npx prisma studio            # Open database browser
npm run db:push              # Push schema (dev only)
npm run db:reset             # Clear database (dev only)

# Production
npm run migrate:prod         # Apply migrations safely

# Troubleshooting
npx prisma migrate status    # Check migration status
npx prisma validate          # Validate schema
```

---

## 🗂️ SCHEMA STRUCTURE

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │
│ name        │
│ email (U)   │
│ password    │
│ role (enum) │
│ createdAt   │
└──────┬──────┘
       │ assigns ↓
       │
┌──────────────────────────┐       ┌──────────────┐
│        Task              │◄──┬──│   Project    │
├──────────────────────────┤   │  ├──────────────┤
│ id                       │   │  │ id           │
│ title                    │   │  │ name         │
│ description              │   │  │ description  │
│ priority (enum)          │   │  │ status (enum)│
│ status (enum)            │   │  │ progress     │
│ dueDate                  │   │  │ createdAt    │
│ projectId (FK) ───────────┘   │  └──────────────┘
│ assigneeId (FK) ─────────────┘
│ createdAt                │
└──────────────────────────┘
```

---

## ❗ IMPORTANT BEHAVIOR

### Delete Cascade (Project → Task)
When you delete a project, all its tasks are deleted too.
```javascript
await prisma.project.delete({ where: { id: projectId } });
// Tasks are DELETED
```

### Delete SetNull (User → Task)
When you delete a user, their tasks remain but lose the assignee.
```javascript
await prisma.user.delete({ where: { id: userId } });
// Tasks remain with assigneeId = null
```

### Unique Constraint
Email must be unique - can't create two users with same email.
```javascript
// ✅ Works
await prisma.user.create({ data: { email: 'john@example.com', ... } });

// ❌ Fails - Email exists
await prisma.user.create({ data: { email: 'john@example.com', ... } });
```

---

## 🐛 ERROR CODES

| Code | Meaning | What to do |
|------|---------|-----------|
| P2002 | Unique constraint violated | Check for duplicate email |
| P2025 | Record not found | Verify ID exists |
| P2003 | Foreign key constraint | Check parent record exists |
| P2014 | Required relation | Check required field set |

---

## 📚 DOCUMENTATION FILES

| File | Purpose |
|------|---------|
| **START_HERE.md** | Overview (you are here) |
| **PRISMA_COMPLETE_GUIDE.md** | Master reference |
| **PRISMA_GUIDE.md** | Full tutorial |
| **PRISMA_SCHEMA_REFERENCE.md** | Quick lookup |
| **MIGRATION_GUIDE.md** | Database versioning |
| **SETUP_CHECKLIST.md** | Setup steps |
| **VERIFICATION_GUIDE.md** | Verify setup |

---

## ⚡ QUICK PATTERNS

### Pattern: Get User with All Tasks
```javascript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { assignedTasks: { include: { project: true } } }
});
```

### Pattern: Get Project Stats
```javascript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    tasks: {
      select: {
        status: true,
        priority: true
      }
    }
  }
});
```

### Pattern: Find High Priority Tasks
```javascript
const urgent = await prisma.task.findMany({
  where: {
    priority: 'High',
    status: { not: 'Completed' }
  },
  include: { assignee: true, project: true },
  orderBy: { dueDate: 'asc' }
});
```

### Pattern: Update Task Status
```javascript
await prisma.task.update({
  where: { id: taskId },
  data: { status: 'Completed' }
});
```

### Pattern: Delete with Cascade
```javascript
// All tasks automatically deleted
await prisma.project.delete({ where: { id: projectId } });
```

---

## 🚨 COMMON MISTAKES

❌ **Wrong: String case matters**
```javascript
// ❌ WRONG - Will fail
const task = await prisma.task.create({
  data: { status: 'inprogress' }  // Should be 'InProgress'
});
```

✅ **Right: Use exact enum value**
```javascript
// ✅ RIGHT
const task = await prisma.task.create({
  data: { status: 'InProgress' }
});
```

---

❌ **Wrong: Forget to include relations**
```javascript
// ❌ Returns task without project info
const task = await prisma.task.findUnique({
  where: { id: taskId }
});
```

✅ **Right: Use include**
```javascript
// ✅ Returns task with project
const task = await prisma.task.findUnique({
  where: { id: taskId },
  include: { project: true }
});
```

---

❌ **Wrong: String validation**
```javascript
// ❌ Bad - Manual validation
if (status !== 'todo' && status !== 'done') {
  throw Error('Invalid status');
}
```

✅ **Right: Use enums**
```javascript
// ✅ Good - Database enforces
await prisma.task.create({
  data: { status: 'Todo' }  // Only valid values allowed
});
```

---

## 📝 HELPFUL QUERIES

### Get Tasks Due This Week
```javascript
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const tasks = await prisma.task.findMany({
  where: {
    dueDate: {
      gte: new Date(),
      lte: nextWeek
    }
  }
});
```

### Get All Active Projects with Task Count
```javascript
const projects = await prisma.project.findMany({
  where: { status: 'Active' },
  include: {
    _count: { select: { tasks: true } }
  }
});
```

### Get Users and Their Task Count
```javascript
const users = await prisma.user.findMany({
  include: {
    _count: { select: { assignedTasks: true } }
  }
});
```

---

## ✅ BEFORE YOU START

- [ ] PostgreSQL running
- [ ] Database created
- [ ] `npm run prisma:generate` completed
- [ ] `npm run migrate` completed
- [ ] `npx prisma studio` shows 3 tables
- [ ] Can import: `import prisma from '../config/database.js'`

---

## 🎯 YOUR NEXT STEPS

1. Run setup commands (if not done)
2. Keep this card nearby
3. Reference PRISMA_COMPLETE_GUIDE.md for details
4. Start building controllers with Prisma
5. Use Prisma Studio to verify data

---

**Print this and keep it at your desk!** 📌

---

**Prisma Schema:** Ready ✅  
**Database:** Ready ✅  
**Documentation:** Complete ✅  
**You:** Ready to Build! 🚀
