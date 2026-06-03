# Taskr Frontend

A modern React-based user interface for the Taskr team task management system with real-time updates, role-based dashboards, and advanced analytics.

## Tech Stack

- **Framework:** React.js (v19.2.6)
- **Build Tool:** Vite (v8.0.13)
- **Styling:** Tailwind CSS (v3.4.19)
- **Routing:** React Router DOM (v7.15.1)
- **HTTP Client:** Axios (v1.16.1)
- **Port:** 5173 (development)
- **Theme:** Green & White Professional Theme with Tailwind

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.jsx      # Top navigation bar
│   ├── Sidebar.jsx     # Side navigation menu
│   ├── TaskRow.jsx     # Task list item
│   ├── ProjectCard.jsx # Project display card
│   └── ...
├── pages/              # Full page components
│   ├── Login.jsx       # Authentication page
│   ├── Signup.jsx      # Registration page
│   ├── Dashboard.jsx   # User dashboard
│   ├── Projects.jsx    # Projects list
│   ├── Tasks.jsx       # Tasks management
│   ├── Members.jsx     # Team management (admin)
│   └── ...
├── context/            # React context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ThemeContext.jsx # Theme management
├── services/
│   └── api.js          # Axios API client with interceptors
└── App.jsx            # Root component
```

## Features

- 🔐 **Secure JWT Authentication:** Email/password login with password reset
- 👥 **Role-Based Dashboards:** Separate views for Admins and Members
- 📊 **Real-Time Analytics:** Performance metrics and project tracking
- 📂 **Project Management:** Create and manage team projects
- 👤 **Team Management:** Add/remove team members (admin only)
- 📋 **Task Tracking:** Complete task lifecycle management
- 🎨 **Modern UI/UX:** Responsive design with smooth animations

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend connects to the backend API at `http://localhost:5000/api`.
