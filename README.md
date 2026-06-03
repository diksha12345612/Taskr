# 🚀 Taskr - Team Task Management System

**Taskr** is a production-ready, full-stack collaborative platform designed for teams to manage projects, assign tasks, and track performance in real-time.

🌐 **Live Demo:** [https://web-production-c48f8.up.railway.app](https://web-production-c48f8.up.railway.app)

## �️ Local Development

Run the application locally on your machine:

```bash
# Start both frontend and backend
npm run dev
```

**Frontend:** http://localhost:5173
**Backend API:** http://localhost:5000/api

**Test Credentials:**
- Email: `admin@example.com`
- Password: `Admin@123456`

## �📸 Screenshots & Features

### Login & Authentication
- **Email/Password Login** with strong password validation
- Forgot password functionality with token-based reset
- Professional green & white themed interface
- Form validation with visual feedback

### User Registration  
- Create account with full name and email
- Strong password requirements (6+ chars, uppercase, lowercase, number, special char)
- Account Type selection (Member or Admin - admin enforced on backend)
- Email verification support
- All signups default to Member role for security

### Admin Dashboard
- Personalized greeting ("Good afternoon, Admin!")
- Daily digest with task summary
- Tasks by status breakdown (To Do, In Progress, Done)
- Projects overview and team metrics
- Navigation access to Management features
- Real-time task statistics

### Team Management
- "Meet the team" page for admins
- View all team members with assigned roles
- Role badges showing Admin/Member status
- Add new team members (admin only)
- Delete members from team (admin only)
- Search and filter functionality

### Performance Analytics
- Global velocity and project completion metrics
- High Pressure Load indicators
- Project stability analysis
- Average turnaround time tracking
- Detailed performance breakdown by project
- Admin-only analytics dashboard

## ✨ Key Features

- 🔐 **Secure Authentication:** JWT-based email/password system with secure **Password Reset** flow
- 👥 **Role-Based Access Control (RBAC):** Separate dashboards for **Admins** and **Members**
- 📊 **Advanced Analytics:** Real-time tracking of tasks, projects, and team productivity
- 📂 **Project Management:** Create projects and assign multiple team members
- 👤 **Team Management:** Admin features to add members and manage team roles
- 📋 **Task Tracking:** Comprehensive task management with status tracking (To Do, In Progress, Done)
- 🌿 **Premium UI/UX:** Modern Green & White professional theme with smooth animations

## 🛠️ Tech Stack

- **Frontend:** React.js 19, Vite 8, Tailwind CSS 3
- **Backend:** Node.js, Express.js 4
- **Database:** SQLite (via Prisma ORM 5)
- **Authentication:** JWT with bcryptjs password hashing

## 🚀 Installation

1. Install dependencies: `npm run install-all`
2. Sync Database: `cd backend && npx prisma db push`
3. Run App: `npm run dev`

Once running, access the application at:
- 🌐 **Frontend:** http://localhost:5173
- 🔗 **API:** http://localhost:5000/api
- 📊 **Prisma Studio:** `npx prisma studio` (in backend directory)
