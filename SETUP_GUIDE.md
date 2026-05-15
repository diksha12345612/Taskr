# PostgreSQL & Prisma Setup Guide for Taskr Backend

## Quick Start

### Step 1: Install PostgreSQL

#### Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run installer and follow prompts
3. Remember the superuser password
4. Default port: 5432

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Step 2: Create Database and User

#### Using psql (Interactive)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskr_db;

# Create user
CREATE USER taskr_user WITH PASSWORD 'taskr_password';

# Grant privileges
ALTER ROLE taskr_user SET client_encoding TO 'utf8';
ALTER ROLE taskr_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE taskr_user SET default_transaction_deferrable TO on;
ALTER ROLE taskr_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE taskr_db TO taskr_user;

# Exit
\q
```

#### Using Shell Commands (One-liners)

```bash
# Create database
createdb -U postgres taskr_db

# Create user (interactive)
createuser -P -U postgres taskr_user

# Grant privileges
psql -U postgres -d taskr_db -c "GRANT ALL PRIVILEGES ON DATABASE taskr_db TO taskr_user;"
```

### Step 3: Verify Connection

```bash
# Test connection
psql -U taskr_user -d taskr_db -h localhost

# If successful, you'll see:
# taskr_db=>
# Type \q to exit
```

### Step 4: Update .env

```env
DATABASE_URL=postgresql://taskr_user:taskr_password@localhost:5432/taskr_db
```

### Step 5: Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create tables from schema
npm run migrate

# Or push schema (for initial setup)
npm run db:push
```

### Step 6: Start Server

```bash
npm run dev
```

## Troubleshooting

### "password authentication failed"

1. Verify credentials in .env
2. Check user exists:
   ```bash
   psql -U postgres -c "\du"
   ```
3. Reset password:
   ```bash
   psql -U postgres
   ALTER USER taskr_user WITH PASSWORD 'new_password';
   ```

### "Database does not exist"

```bash
# List all databases
psql -U postgres -l

# Create if missing
createdb -U postgres taskr_db
```

### "Could not connect to server"

1. Check PostgreSQL is running
2. Windows: Services → PostgreSQL
3. macOS: `brew services list`
4. Linux: `sudo systemctl status postgresql`

### Port Already in Use

Default PostgreSQL port is 5432. If in use:

```bash
# Change in .env
DATABASE_URL=postgresql://taskr_user:taskr_password@localhost:5433/taskr_db

# Then restart PostgreSQL on different port
```

## Using Prisma Studio

```bash
# Open visual database browser
npx prisma studio

# Opens at http://localhost:5555
```

## Reset Database (Development Only)

```bash
# WARNING: Deletes all data
npm run db:reset

# Then run migrations again
npm run migrate
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Port 5432 in use | Change port in connection string |
| Authentication failed | Verify username, password in .env |
| Database not found | Run `npm run migrate` |
| Prisma Client error | Run `npm run prisma:generate` |

## Environment Variables Explained

```env
# Format: postgresql://[user]:[password]@[host]:[port]/[database]
DATABASE_URL=postgresql://taskr_user:taskr_password@localhost:5432/taskr_db

# Parts:
# - taskr_user: Database user
# - taskr_password: User password
# - localhost: Host (local machine)
# - 5432: PostgreSQL default port
# - taskr_db: Database name
```

## Schema Migrations

```bash
# Create new migration
npm run migrate -- --name add_new_table

# Apply pending migrations
npm run migrate:prod

# Reset to clean state
npm run db:reset
```

## Next Steps

1. Install dependencies: `npm install`
2. Set up PostgreSQL database
3. Configure .env file
4. Run: `npm run migrate`
5. Start server: `npm run dev`

---

For more info: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-sql
