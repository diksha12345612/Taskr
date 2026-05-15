# 🌿 Taskr: The Humanised Team Workspace

**Taskr** is a premium, full-stack team management and HR ecosystem designed with a focus on **human-centric design** and **organic collaboration**. It transforms the typical "cold" management experience into a warm, tactile workspace that feels alive and approachable.

![Dashboard Preview](https://via.placeholder.com/1200x600/1e1b4b/ffffff?text=Taskr+Humanised+Workspace)

## ✨ Key Features

### 🎨 Humanised UI/UX
*   **Custom Glassmorphism**: A deep, tactile design system with "frosted glass" containers and soft-rose accents.
*   **Spring-Based Motion**: Every interaction uses natural physics-based animations to make the app feel reactive and weighted.
*   **Conversational Interface**: Friendly greetings and humanised feedback messages throughout the app.

### 📊 Performance Analytics (Visualized)
*   **Weekly Rhythm Graph**: A custom-built 7-day bar chart that visualizes your team's productivity peaks.
*   **Intelligent Ratings**: Dynamic performance scoring (🌟 Best, ⚡ Average, 🐢 Needs Focus) based on real completion data.
*   **Growth Insights**: Automated, humanised tips to help team members improve their consistency and focus.

### ⏰ Integrated HR Suite
*   **Presence Tracking**: A tactile Check-in/Out system that syncs with standard team hours (10:30 AM – 7:00 PM).
*   **Leave Management**: Dedicated dashboard for submitting and approving leave requests with role-based transparency.

### 🛡️ Administrative Command Center
*   **Member Lifecycle**: Securely invite new teammates or remove members directly from the interface.
*   **Role-Based Access**: Granular control for Admin, Manager, and Member roles across all modules.

---

## 📊 Database Architecture

Taskr uses **Prisma ORM** with a relational structure designed for performance and data integrity.

### 🧱 Core Models
*   **User**: Stores profiles, hashed credentials, and system roles (`Admin`, `Manager`, `Member`).
*   **Project**: High-level initiatives with progress tracking and status lifecycle.
*   **Task**: Individual action items linked to Projects and assigned to Users.
*   **Attendance**: Daily logs tracking `checkIn` and `checkOut` timestamps for every member.
*   **Leave**: Managed requests for time off, tracking dates, reasons, and approval status.

### 🔗 Key Relationships
*   **One-to-Many**: A `Project` can have many `Tasks`.
*   **One-to-Many**: A `User` can be assigned many `Tasks`.
*   **Self-Referencing**: Attendance and Leaves are strictly tied to a `User` identity for secure HR tracking.

### 🛠️ Database Management
To explore the database visually, you can run:
```bash
cd backend
npx prisma studio
```

---

## 🛠️ Technical Stack

*   **Frontend**: React 18, Vite, Custom Vanilla CSS (Design Tokens), React Router 6.
*   **Backend**: Node.js, Express, Prisma ORM.
*   **Database**: PostgreSQL / SQLite (via Prisma).
*   **Security**: JWT Authentication, Bcrypt password hashing, and Role-Based Authorization Middleware.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/diksha12345612/Taskr.git
cd Taskr
```

### 2. Setup the Backend
```bash
cd backend
npm install
# Configure your .env file with DATABASE_URL
npx prisma migrate dev
npx prisma db seed
npm start
```

### 3. Setup the Frontend
```bash
cd taskr-app
npm install
npm run dev
```

---

## ⚖️ License
Distributed under the **MIT License**. See `LICENSE` for more information.

## 🤝 Contact
**Project Owner**: [Diksha Pal](https://github.com/diksha12345612)

---
*Created with ❤️ by the Taskr Team.*
