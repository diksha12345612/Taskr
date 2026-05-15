import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTasks, getUsers } from '../services/api';

function NavItem({ item }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group/item ${
        isActive 
          ? 'bg-[var(--accent-dim)] text-[var(--accent)] shadow-sm' 
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover/item:scale-110'}`}>
          {item.icon}
        </div>
        <span className="text-[13px] font-[800] tracking-tight">{item.label}</span>
      </div>
      {item.badge && item.badge.count > 0 && (
        <span 
          className="text-[10px] font-black px-2 py-0.5 rounded-lg transition-all"
          style={{ backgroundColor: item.badge.color, color: 'white' }}
        >
          {item.badge.count}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [taskCount, setTaskCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [tasksRes, usersRes] = await Promise.all([getTasks(), getUsers()]);
        setTaskCount(tasksRes.data.data?.filter(t => t.status !== 'Completed').length || 0);
        setMemberCount(usersRes.data.data?.length || 0);
      } catch (err) {
        console.error('Sidebar data fetch failed:', err);
      }
    })();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { label: 'Projects', path: '/projects', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
    )},
    { label: 'My Tasks', path: '/tasks', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    ), badge: { count: taskCount, color: 'var(--red)' } },
    { label: 'Timeline', path: '/timeline', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
  ];

  const manageNav = [
    { label: 'Members', path: '/members', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-3.47M20 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ), badge: { count: memberCount, color: 'var(--green)' } },
    { label: 'Attendance', path: '/attendance', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" /></svg>
    )},
    { label: 'Leaves', path: '/leaves', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: 'Reports', path: '/reports', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
    { label: 'Settings', path: '/settings', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[236px] bg-[var(--bg-surface)] border-r border-[var(--border)] z-[100] flex flex-col p-5 shadow-2xl">
      {/* Brand */}
      <div className="px-3 mb-10 mt-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-[var(--accent)] to-[var(--warm-accent)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--accent-dim)]">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-[18px] font-[900] tracking-tighter text-[var(--text-primary)] leading-none">Taskr</h2>
          <p className="text-[9px] font-bold text-[var(--text-faint)] uppercase tracking-widest mt-1">Workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-1">
        <div>
          <h3 className="px-4 mb-4 text-[10px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em]">Home Base</h3>
          <div className="space-y-1">
            {mainNav.map(item => <NavItem key={item.path} item={item} />)}
          </div>
        </div>

        <div>
          <h3 className="px-4 mb-4 text-[10px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em]">Workspace</h3>
          <div className="space-y-1">
            {manageNav
              .filter(item => {
                if (item.label === 'Members' && user?.role !== 'Admin') return false;
                return true;
              })
              .map(item => <NavItem key={item.path} item={item} />)
            }
          </div>
        </div>
      </nav>

      {/* User Card */}
      <div className="mt-auto pt-6 border-t border-[var(--border)]">
        <div className="group/user p-4 bg-[var(--bg-raised)] rounded-3xl border border-transparent hover:border-[var(--border-hover)] transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-[15px] font-bold text-white shadow-inner">
              {user?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-[800] text-[var(--text-primary)] truncate">{user?.name}</p>
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border)] opacity-0 group-hover/user:opacity-100 transition-all transform translate-y-2 group-hover/user:translate-y-0">
            <button 
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center p-2.5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)] rounded-xl transition-all"
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M14.998 12a2.999 2.999 0 11-5.998 0 2.999 2.999 0 015.998 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center p-2.5 text-[var(--text-muted)] hover:text-[var(--red)] hover:bg-[var(--red-dim)] rounded-xl transition-all"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
