import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../services/api';

function NavItem({ item }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 font-bold' 
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-dim)]'
      }`}
    >
      <div className="flex items-center gap-3">
        {item.icon}
        <span className="text-sm tracking-tight">{item.label}</span>
      </div>
      {item.badge && item.badge.count > 0 && (
        <span 
          className={`text-[9px] font-black px-1.5 py-0.5 rounded-md transition-all duration-300 ${
            isActive ? 'bg-white text-[var(--accent)]' : 'bg-[var(--accent)] text-white'
          }`}
        >
          {item.badge.count}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const tasksRes = await getTasks();
        setTaskCount(tasksRes.data.data?.filter(t => t.status !== 'Completed').length || 0);
      } catch (err) {
        console.error('Sidebar data fetch failed:', err);
      }
    })();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { label: 'Projects', path: '/projects', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
    )},
    { label: 'My Tasks', path: '/tasks', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    ), badge: { count: taskCount } },
    { label: 'Timeline', path: '/timeline', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: 'Attendance', path: '/attendance', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { label: 'Time Off', path: '/leaves', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
    )}
  ];

  const adminItems = [
    { label: 'My Team', path: '/members', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-3.47M20 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { label: 'Insights', path: '/reports', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )}
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[236px] bg-[var(--bg-surface)] backdrop-blur-xl border-r border-[var(--border)] z-50 flex flex-col p-6 shadow-sm transition-all duration-300">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 bg-[var(--accent)] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[var(--accent)]/20">T</div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Taskr</h2>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        <p className="px-4 pb-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Navigation</p>
        {navItems.map(item => <NavItem key={item.path} item={item} />)}
        
        {user?.role === 'Admin' && (
          <>
            <p className="px-4 pt-8 pb-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Management</p>
            {adminItems.map(item => <NavItem key={item.path} item={item} />)}
          </>
        )}
        
        <NavItem item={{ label: 'Settings', path: '/settings', icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        )}} />
      </nav>

      <div className="mt-auto pt-6 border-t border-[var(--border)]">
        <div className="p-4 bg-[var(--bg-raised)] rounded-2xl border border-[var(--border)] group transition-all duration-300 hover:bg-[var(--bg-surface)] hover:shadow-md">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-white font-bold shadow-lg shadow-[var(--accent)]/20">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
              <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={handleLogout}
            className="w-full h-9 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-[var(--red)] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
