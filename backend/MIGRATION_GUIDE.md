# Prisma Migration Setup & Commands

## Quick Start (3 Steps)

### Step 1: Generate Prisma Client
```bash
cd backend
npm run prisma:generate
```

### Step 2: Create Initial Migration
```bash
npm run migrate
```

This will:
1. Prompt you to name the migration (suggest: `init` or `initial_schema`)
2. Create `prisma/migrations/` directory
3. Generate SQL migration files
4. Apply migrations to your PostgreSQL database
5. Create all tables automatically

### Step 3: Verify Setup
```bash
npx prisma studio
```

Opens visual database browser at http://localhost:5555

## Understanding Migrations

### What is a Migration?
A migration is a version-controlled record of database schema changes. Prisma generates SQL that:
- Creates new tables
- Modifies existing tables
- Manages relationships and constraints

### Migration Files Location
```
backend/prisma/migrations/
├── 20260515120000_init/
│   └── migration.sql
├── 20260515120100_add_new_field/
│   └── migration.sql
└── .env
```

Each migration has a timestamp and descriptive name.

## Prisma Commands Reference

### Development Commands

```bash
# Generate Prisma Client (run after schema changes)
npm run prisma:generate
# Or: npx prisma generate

# Create and apply migration interactively
npm run migrate
# Or: npx prisma migrate dev
# Prompts for migration name and applies immediately

# Push schema directly without migration (dev only)
npm run db:push
# Or: npx prisma db push
# WARNING: Doesn't create migration files - use only for quick testing

# Reset database to clean state (dev only)
npm run db:reset
# Or: npx prisma migrate reset
# WARNING: Deletes all data! Only use in development
```

### Production Commands

```bash
# Apply pending migrations (safe, for production)
npm run migrate:prod
# Or: npx prisma migrate deploy
# Applies all unapplied migrations without prompting
```

### Utility Commands

```bash
# Open visual database browser
npx prisma studio
# Opens at http://localhost:5555

# View migration status
npx prisma migrate status
# Shows applied and pending migrations

# Create empty migration for manual SQL
npx prisma migrate dev --create-only
# Useful for complex SQL that Prisma can't generate

# Resolve migration conflicts
npx prisma migrate resolve --rolled-back <migration_name>
```

## Step-by-Step Migration Process

### Initial Setup (First Time)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Ensure database exists (created via PostgreSQL)
# DATABASE_URL in .env points to existing database

# 3. Generate Prisma Client
npm run prisma:generate
# Output: ✔ Generated Prisma Client

# 4. Create initial migration
npm run migrate
# Output: 
# ✔ Generated migration 20260515120000_init
# ✔ Your database has been successfully migrated to 20260515120000_init

# 5. Verify database tables created
npx prisma studio
# Confirm you see: users, projects, tasks tables
```

### After Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# (Add new model, field, enum, etc.)

# 2. Generate Prisma Client
npm run prisma:generate

# 3. Create migration for changes
npm run migrate
# Enter migration name: e.g., "add_comment_field"

# 4. Verify migration created correctly
npx prisma migrate status
```

### Deploying to Production

```bash
# 1. Push code to GitHub with new migrations

# 2. On production server/Railway:
npm install
npm run migrate:prod

# This applies all unapplied migrations
```

## Generated SQL Example

When you run `npm run migrate`, Prisma generates SQL like:

```sql
-- CreateTable users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable projects
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "progress" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable tasks
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Todo',
    "dueDate" DATE,
    "projectId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");
CREATE INDEX "idx_users_role" ON "users"("role");
CREATE INDEX "idx_projects_status" ON "projects"("status");
CREATE INDEX "idx_projects_progress" ON "projects"("progress");
CREATE INDEX "idx_tasks_projectId" ON "tasks"("projectId");
CREATE INDEX "idx_tasks_assigneeId" ON "tasks"("assigneeId");
CREATE INDEX "idx_tasks_status" ON "tasks"("status");
CREATE INDEX "idx_tasks_priority" ON "tasks"("priority");
CREATE INDEX "idx_tasks_dueDate" ON "tasks"("dueDate");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" 
  FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" 
  FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

## Migration History

Your migrations are version-controlled in `prisma/migrations/`. Each contains:

- **timestamp** - When migration was created
- **name** - Descriptive identifier
- **migration.sql** - The actual SQL
- **migration_lock.toml** - Prevents concurrent migrations

```bash
# View migration files
ls -la prisma/migrations/

# View migration SQL
cat prisma/migrations/20260515120000_init/migration.sql
```

## Common Migration Scenarios

### Scenario 1: Add New Field to Existing Model

```prisma
// In schema.prisma - add new field
model Task {
  // ... existing fields ...
  color String @default("blue")  // NEW FIELD
}
```

```bash
# Generate migration
npm run migrate

# Name it: "add_color_field_to_task"

# Done! Field added and data migrated
```

### Scenario 2: Add New Model

```prisma
// In schema.prisma - add new model
model Comment {
  id String @id @default(cuid())
  text String
  taskId String
  task Task @relation(fields: [taskId], references: [id])
  createdAt DateTime @default(now())
}

// Update Task model
model Task {
  // ... existing fields ...
  comments Comment[]
}
```

```bash
npm run migrate
# Name it: "add_comments_model"
```

### Scenario 3: Rename Field

```prisma
// In schema.prisma
model Task {
  // Old: dueDate DateTime?
  dueAt DateTime? @map("dueDate")  // Renames in database
  
  @@map("tasks")  // Renames table
}
```

```bash
npm run migrate
# Name it: "rename_due_date_to_due_at"
```

## Migration Best Practices

✅ **DO**
- Commit migrations to git
- Use descriptive migration names
- Run `npm run migrate:prod` in production
- Test migrations locally first
- Back up production database before migrating

❌ **DON'T**
- Modify migration files manually (unless you know SQL)
- Use `db:push` in production
- Run `db:reset` on production data
- Change schema without creating migrations
- Delete migration files

## Troubleshooting Migrations

### "Cannot find module @prisma/client"
```bash
npm run prisma:generate
npm install
```

### "Migration already exists"
```bash
# You've already created this schema change
# Either apply it: npm run migrate
# Or reset: npm run db:reset (dev only)
```

### "Database does not exist"
```bash
# Create database first
createdb taskr_db

# Then run migration
npm run migrate
```

### "User does not have permission"
```bash
# Grant privileges to user
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE taskr_db TO taskr_user;"

# Then retry migration
npm run migrate
```

### "Foreign key constraint fails"
```bash
# Schema has relationship errors
# Review foreign keys in schema.prisma
# Fix the relationship
# Run: npm run migrate
```

## Environment-Specific Migrations

### Development
```bash
# Schema and data can change freely
npm run db:push      # Quick iteration
npm run migrate      # Version-controlled changes
npm run db:reset     # Start fresh
```

### Production
```bash
# Careful, ordered migrations only
npm run migrate:prod # Apply pending migrations
# ALWAYS back up first!
```

## Checking Migration Status

```bash
# View all migrations
npx prisma migrate status

# Sample output:
# Status: Pending
# Following migrations have not yet been applied:
#   20260515120000_init
#   20260515120100_add_comments

# After running npm run migrate:
# Status: Up to date
# All migrations have been applied
```

## Manual Migration SQL

For complex changes Prisma can't handle:

```bash
# Create empty migration
npx prisma migrate dev --create-only

# Name it: "complex_schema_change"

# Edit the SQL file:
# prisma/migrations/<timestamp>_complex_schema_change/migration.sql

# Add your custom SQL, then apply:
npm run migrate
```

## Database Backup Before Migration (Production)

```bash
# PostgreSQL backup
pg_dump -U taskr_user taskr_db > backup.sql

# Run migration
npm run migrate:prod

# If something goes wrong, restore:
psql -U taskr_user taskr_db < backup.sql
```

## Commands Summary Table

| Command | Environment | Purpose |
|---------|-------------|---------|
| `npm run prisma:generate` | Dev/Prod | Generate Prisma Client |
| `npm run migrate` | Dev | Create and apply migration |
| `npm run db:push` | Dev only | Push schema directly |
| `npm run db:reset` | Dev only | Delete all data |
| `npm run migrate:prod` | Prod | Apply migrations safely |
| `npx prisma studio` | Dev | Visual database browser |
| `npx prisma migrate status` | Dev/Prod | Check migration status |

## Next Steps

1. **Generate Client**: `npm run prisma:generate`
2. **Create Migration**: `npm run migrate`
3. **Verify Tables**: `npx prisma studio`
4. **Start Using Prisma**: In your controllers, import and use `prisma`

---

**Prisma Version:** 5.8.0+  
**Database:** PostgreSQL  
**Schema Status:** ✅ Ready for Migration
