# 🚀 Taskr - Team Task Management System

**Taskr** is a production-ready, full-stack collaborative platform designed for teams to manage projects, assign tasks, and track performance in real-time.

🌐 **Live Demo:** [https://web-production-c48f8.up.railway.app](https://web-production-c48f8.up.railway.app)

## 📸 Screenshots

### Login & Authentication
![Login Page](./backend/login.png)
Email/password authentication with strong password validation and forgot password functionality.

### User Registration
![Signup Page](./backend/signup.png)
Create account with role selection (Member or Admin). All signups default to Member role for security.

### Admin Dashboard
![Admin Dashboard](./backend/dashboard.png)
Real-time dashboard showing daily digest, task statistics, projects, and performance metrics. Admin users have access to team management features.

### Team Management
![Members Page](./backend/members.png)
View all team members with roles (Admin/Member). Admin can add new members and manage the team.

### Performance Analytics
![Insights Page](./backend/insights.png)
Advanced analytics dashboard with global velocity, project completion rates, team stability metrics, and detailed performance breakdowns.

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
