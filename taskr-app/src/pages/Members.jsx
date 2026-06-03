import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, adminCreateUser, deleteUser } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Members() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'Admin';
  
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
    fetchMembers();
  }, []);

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the team?`)) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      alert(`${name} has been removed.`);
    } catch (err) {
      alert('Failed to remove member. They might have active tasks assigned.');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await adminCreateUser(newMember);
      await fetchMembers();
      setShowModal(false);
      setNewMember({ name: '', email: '', password: '', role: 'Member' });
      alert('New member added successfully!');
    } catch (err) {
      alert('Failed to add member. Email might already exist.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-10 lg:p-14 ml-[236px] animate-fade">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-spring">
          <div>
            <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest mb-2">Your Team</p>
            <h1 className="text-4xl font-black tracking-tighter">Meet the team</h1>
          </div>
          
          {isAdmin && (
            <button 
              type="button"
              onClick={() => setShowModal(true)} 
              className="btn-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add New Member
            </button>
          )}
        </header>

        {/* Search Bar */}
        <div className="mb-12 relative w-full max-w-md group animate-spring delay-75">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12 pr-6"
          />
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-48 bg-[var(--glass-bg)] border border-[var(--border)] rounded-3xl animate-pulse" />)
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((u, index) => (
              <div key={u.id} className="card p-8 bg-[var(--glass-bg)] border border-[var(--border)] group hover:border-[var(--accent-dim)] hover:shadow-lg hover:shadow-[var(--accent)]/5 transition-all duration-300 relative animate-spring" style={{ animationDelay: `${index * 75}ms` }}>
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-[var(--accent)]/20">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] truncate">{u.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] truncate font-medium">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    u.role === 'Admin' ? 'bg-[var(--red-dim)] text-[var(--red)]' : 'bg-[var(--accent-dim)] text-[var(--accent)]'
                  }`}>
                    {u.role}
                  </span>
                  
                  {isAdmin && currentUser.id !== u.id && (
                    <button 
                      type="button"
                      onClick={() => handleRemove(u.id, u.name)}
                      className="p-2 text-[var(--text-muted)] hover:text-[var(--red)] transition-all bg-[var(--bg-raised)] hover:bg-[var(--red-dim)] rounded-xl"
                      title="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-[var(--glass-bg)] rounded-[40px] border border-[var(--border)]">
               <div className="text-5xl mb-6 grayscale opacity-20">👋</div>
               <p className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Nobody found</p>
               <p className="text-xs text-[var(--text-muted)] font-medium italic">Try searching for someone else, or invite a new member.</p>
            </div>
          )}
        </div>

        {/* Add Member Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] backdrop-blur-xl w-full max-w-md rounded-[32px] p-10 shadow-2xl text-[var(--text-primary)] animate-spring">
              <h2 className="text-2xl font-black tracking-tight mb-2">Invite a team member</h2>
              <p className="text-sm text-[var(--text-muted)] font-medium mb-8">Add someone new to your workspace.</p>

              <form onSubmit={handleAddMember} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input required type="text" value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} className="input-field" placeholder="Sarah Jenkins" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input required type="email" value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} className="input-field" placeholder="sarah@company.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">Password</label>
                    <input required type="password" value={newMember.password} onChange={(e) => setNewMember({...newMember, password: e.target.value})} className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">Role</label>
                    <select value={newMember.role} onChange={(e) => setNewMember({...newMember, role: e.target.value})} className="input-field cursor-pointer">
                      <option value="Member" className="bg-[var(--bg-base)]">Member</option>
                      <option value="Admin" className="bg-[var(--bg-base)]">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-12 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Add Member</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
