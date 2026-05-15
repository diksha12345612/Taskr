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
    alert('Profile update logic will be implemented here!');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert('New passwords do not match');
      return;
    }
    alert('Password change logic will be implemented here!');
  };

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pl-[236px]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-8">
        <header className="mb-10" style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
          <h1 className="text-[26px] font-[800] font-outfit tracking-tight">System Settings</h1>
          <p className="text-[12px] text-[var(--text-muted)] font-medium">Manage your account preferences and application configuration</p>
        </header>

        <div className="max-w-2xl space-y-8">
          {/* Profile Section */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[24px] p-8 shadow-sm">
            <h2 className="text-[18px] font-bold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-faint)] uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl p-3 text-[13px] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-faint)] uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl p-3 text-[13px] outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
              <button type="submit" className="px-6 h-[42px] bg-[var(--bg-raised)] border border-[var(--border)] font-bold text-[13px] rounded-xl hover:border-[var(--accent)] transition-all">
                Save Changes
              </button>
            </form>
          </section>

          {/* Preferences Section */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[24px] p-8 shadow-sm">
            <h2 className="text-[18px] font-bold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              App Preferences
            </h2>
            <div className="flex items-center justify-between p-4 bg-[var(--bg-raised)] rounded-2xl">
              <div>
                <h4 className="text-[14px] font-bold">Dark Mode</h4>
                <p className="text-[12px] text-[var(--text-muted)]">Switch between light and dark theme</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-all relative ${isDark ? 'bg-[var(--accent)]' : 'bg-[var(--text-faint)]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[24px] p-8 shadow-sm">
            <h2 className="text-[18px] font-bold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-faint)] uppercase mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={password.current}
                  onChange={(e) => setPassword({...password, current: e.target.value})}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl p-3 text-[13px] outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-faint)] uppercase mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={password.new}
                    onChange={(e) => setPassword({...password, new: e.target.value})}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl p-3 text-[13px] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-faint)] uppercase mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={password.confirm}
                    onChange={(e) => setPassword({...password, confirm: e.target.value})}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl p-3 text-[13px] outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
              <button type="submit" className="px-6 h-[42px] bg-[var(--red)] text-white font-bold text-[13px] rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/10">
                Update Password
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
