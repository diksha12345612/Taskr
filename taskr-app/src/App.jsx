import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Timeline from './pages/Timeline';
import Members from './pages/Members';
import Reports from './pages/Reports';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Settings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import InteractiveBackground from './components/InteractiveBackground';

function App() {
  return (
    <>
      <InteractiveBackground />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Only Routes */}
        <Route element={<RoleProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/members" element={<Members />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}


export default App;
