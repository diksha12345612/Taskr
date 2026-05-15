import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, adminCreateUser, deleteUser } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Members() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'Member' });

  const fetchMembers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role !== 'Admin') {
      window.location.href = '/dashboard';
      return;
    }
    fetchMembers();
  }, [currentUser]);

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the workspace?`)) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      alert(`${name} has been removed.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await adminCreateUser(newMember);
      await fetchMembers();
      setShowModal(false);
      setNewMember({ name: '', email: '', password: '', role: 'Member' });
      alert('Welcome aboard! The new member has been added.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pl-[236px]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-10">
        <header className="flex items-center justify-between mb-12" style={{ animation: 'springIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">👥</span>
              <h1 className="text-[32px] font-[800] tracking-tight">Team Members</h1>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] font-medium">Manage your workspace collaborators and their roles.</p>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="h-[48px] px-8 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[14px] font-bold rounded-2xl transition-all shadow-lg shadow-[var(--accent-dim)] transform active:scale-95"
          >
            Invite Member
          </button>
        </header>

        <div className="mb-8" style={{ animation: 'springIn 0.8s ease 0.1s both' }}>
          <div className="relative w-full max-w-[400px]">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-3.5 text-[13px] outline-none focus:border-[var(--accent)] transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12" style={{ animation: 'springIn 0.8s ease 0.2s both' }}>
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[180px] glass-card animate-pulse" />
            ))
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div 
                key={user.id} 
                className="glass-card p-8 hover:translate-y-[-6px] transition-all duration-300 group relative"
              >
                {currentUser.id !== user.id && (
                  <button 
                    onClick={() => handleRemove(user.id, user.name)}
                    className="absolute top-6 right-6 p-2 text-[var(--text-faint)] hover:text-[var(--red)] hover:bg-[var(--red-dim)] rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove Member"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}

                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-hover)] rounded-2xl flex items-center justify-center text-[22px] font-[800] text-white shadow-lg shadow-[var(--accent-dim)]">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-[800] text-[var(--text-primary)] truncate">{user.name}</h3>
                    <p className="text-[12px] text-[var(--text-muted)] truncate font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-[var(--glass-border)]">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.role === 'Admin' ? 'bg-[var(--red-dim)] text-[var(--red)]' : 
                    user.role === 'Manager' ? 'bg-[var(--amber-dim)] text-[var(--amber)]' : 
                    'bg-[var(--green-dim)] text-[var(--green)]'
                  }`}>
                    {user.role}
                  </span>
                  
                  <span className="text-[11px] font-black text-[var(--text-faint)] uppercase tracking-tighter">
                    Since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center glass-card">
              <p className="text-[15px] text-[var(--text-muted)] font-medium italic">No teammates found. Maybe it's time to invite some? 🤝</p>
            </div>
          )}
        </div>

        {/* Add Member Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-6">
            <div 
              className="bg-[var(--bg-surface)] border border-[var(--glass-border)] w-full max-w-[500px] rounded-[32px] p-10 shadow-2xl relative"
              style={{ animation: 'springIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <h2 className="text-[24px] font-[800] mb-2">Invite Teammate</h2>
              <p className="text-[14px] text-[var(--text-muted)] mb-10 font-medium">Add a new collaborator to your workspace.</p>

              <form onSubmit={handleAddMember} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
                  <input required type="text" value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all" placeholder="e.g. Jane Cooper" />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Email Address</label>
                  <input required type="email" value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all" placeholder="jane@example.com" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Initial Password</label>
                    <input required type="password" value={newMember.password} onChange={(e) => setNewMember({...newMember, password: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Role</label>
                    <select value={newMember.role} onChange={(e) => setNewMember({...newMember, role: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all">
                      <option value="Member">Member</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-[56px] bg-[var(--bg-raised)] text-[var(--text-primary)] text-[14px] font-bold rounded-2xl hover:bg-[var(--border)] transition-all">Cancel</button>
                  <button type="submit" className="flex-1 h-[56px] bg-[var(--accent)] text-white text-[14px] font-[800] rounded-2xl hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent-dim)]">Add Member</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
