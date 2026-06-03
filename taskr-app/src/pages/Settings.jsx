import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('Changes saved to your workspace profile.');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert('Passwords do not match.');
      return;
    }
    alert('Security credentials updated.');
  };

  return (
    <div className="flex h-screen mesh-gradient text-[var(--text-primary)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-10 lg:p-14 ml-[236px] animate-fade">
        <header className="mb-14">
          <p className="text-xs font-bold text-[var(--accent-secondary)] uppercase tracking-[0.3em] mb-3">Your Settings</p>
          <h1 className="text-5xl font-black tracking-tighter mb-2">Account Settings</h1>
          <p className="text-base text-[var(--text-secondary)] font-medium">Make it feel like home.</p>
        </header>

        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          
          {/* Profile Card */}
          <div className="card p-10 bg-[var(--bg-surface)]">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 rounded-xl bg-[var(--accent-dim)] border border-[var(--accent)]/20 flex items-center justify-center text-xl">👤</div>
               <h3 className="text-xl font-bold tracking-tight">Your Profile</h3>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="input-field h-12"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="input-field h-12"
                />
              </div>
              <button type="submit" className="btn-primary w-full h-12 mt-4">Save Changes</button>
            </form>
          </div>

          {/* Theme & Prefs Card */}
          <div className="card p-10 bg-[var(--bg-surface)] flex flex-col">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 flex items-center justify-center text-xl">🎨</div>
                <h3 className="text-xl font-bold tracking-tight">Environment</h3>
             </div>

             <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                   <div>
                      <p className="text-sm font-bold">Dark Mode</p>
                      <p className="text-xs text-[var(--text-muted)]">Easy on the eyes</p>
                   </div>
                   <button 
                     type="button"
                     onClick={toggleTheme}
                     className={`w-14 h-7 rounded-full transition-all relative ${isDark ? 'bg-[var(--accent)]' : 'bg-slate-700'}`}
                   >
                     <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${isDark ? 'left-8' : 'left-1'}`} />
                   </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/5 opacity-50">
                   <div>
                      <p className="text-sm font-bold">Email Notifications</p>
                      <p className="text-xs text-[var(--text-muted)]">Receive daily system digests</p>
                   </div>
                   <div className="w-14 h-7 rounded-full bg-[var(--green)] relative">
                      <div className="absolute top-1 left-8 w-5 h-5 bg-white rounded-full" />
                   </div>
                </div>
             </div>
          </div>

          {/* Security Card - Full Width */}
          <div className="md:col-span-2 card p-10 bg-black/20 border-dashed border-[var(--red)]/20">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/20 flex items-center justify-center text-xl">🔐</div>
                <h3 className="text-xl font-bold tracking-tight">Change Password</h3>
             </div>

             <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 ml-1">Current Pass</label>
                  <input type="password" placeholder="••••••••" className="input-field h-12" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 ml-1">New Pass</label>
                  <input type="password" placeholder="••••••••" className="input-field h-12" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 ml-1">Confirm New</label>
                  <input type="password" placeholder="••••••••" className="input-field h-12" />
                </div>
                <div className="md:col-span-3 pt-4">
                  <button type="submit" className="px-10 h-12 bg-[var(--red)] text-white font-bold text-sm rounded-xl hover:bg-red-500 transition-all shadow-lg shadow-red-500/10">
                    Update Password
                  </button>
                </div>
             </form>
          </div>

        </div>
      </main>
    </div>
  );
}
