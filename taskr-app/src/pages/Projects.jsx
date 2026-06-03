import { useEffect, useState } from 'react';
import { getProjects, createProject, deleteProject, updateProject, getUsers } from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tempProgress, setTempProgress] = useState(0);

  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '', 
    priority: 'Moderate',
    status: 'Active',
    memberIds: []
  });

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (isAdmin) {
      getUsers().then(res => setAllUsers(res.data.data || [])).catch(() => {});
    }
  }, []);

  const handleUpdateProgress = async (id) => {
    try {
      await updateProject(id, { progress: tempProgress });
      setProjects(projects.map(p => p.id === id ? { ...p, progress: tempProgress } : p));
      setEditingId(null);
      alert('Progress updated!');
    } catch (err) {
      alert('Failed to update progress.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send fields that exist in the database schema
      await createProject({
        name: newProject.name,
        description: newProject.description,
        status: newProject.status,
        memberIds: newProject.memberIds,
        progress: 0
      });
      await fetchProjects();
      setShowModal(false);
      setNewProject({ name: '', description: '', priority: 'Moderate', status: 'Active', memberIds: [] });
    } catch (err) {
      console.error('Create project error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to create project');
    }
  };

  const toggleMember = (id) => {
    setNewProject(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(id)
        ? prev.memberIds.filter(m => m !== id)
        : [...prev.memberIds, id]
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-12 lg:p-16 ml-[236px] animate-fade">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Projects</h1>
            <p className="text-sm text-[var(--text-secondary)] font-medium">Manage your active initiatives and team workspaces.</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              New Project
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
          {loading ? (
            [1,2].map(i => <div key={i} className="h-80 bg-[var(--glass-bg)] rounded-[40px] animate-pulse border border-[var(--border)]" />)
          ) : projects.length > 0 ? (
            projects.map((p, index) => (
            <div key={p.id} className="card p-10 bg-[var(--glass-bg)] border border-[var(--border)] group hover:border-[var(--accent-dim)] hover:shadow-lg hover:shadow-[var(--accent)]/5 transition-all duration-300 relative overflow-hidden flex flex-col animate-spring" style={{ animationDelay: `${index * 100}ms` }}>
              
              <div className="flex justify-between items-start mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-[var(--accent-dim)] flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">📂</div>
                    <div>
                       <h3 className="text-2xl font-black text-[var(--text-primary)] leading-none mb-2">{p.name}</h3>
                       <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                         p.priority === 'High' ? 'bg-[var(--red-dim)] text-[var(--red)]' : 'bg-[var(--accent-dim)] text-[var(--accent)]'
                       }`}>
                          {p.priority} Priority
                       </span>
                    </div>
                 </div>
                 {isAdmin && (
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-[var(--text-faint)] hover:text-[var(--red)] transition-colors">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                 )}
              </div>

              <div className="mb-10">
                 <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed mb-6">{p.description || 'No description provided. Add one to help your team understand the goal!'}</p>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[var(--bg-raised)] rounded-lg text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Active</span>
                    <span className="px-3 py-1 bg-[var(--bg-raised)] rounded-lg text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">In Sync</span>
                 </div>
              </div>

              <div className="mt-auto space-y-8">
                 <div className="pt-8 border-t border-[var(--border)]">
                    <div className="flex justify-between items-end mb-4">
                       <div>
                          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Project Status</p>
                          <p className="text-2xl font-black text-[var(--accent)]">{editingId === p.id ? tempProgress : p.progress}%</p>
                       </div>
                       {editingId === p.id ? (
                          <div className="flex gap-2">
                             <button onClick={() => handleUpdateProgress(p.id)} className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[10px] font-black uppercase rounded-xl transition-all">Save</button>
                             <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-[var(--bg-raised)] text-[var(--text-muted)] text-[10px] font-black uppercase rounded-xl transition-all">Cancel</button>
                          </div>
                       ) : (
                          <button 
                            onClick={() => { setEditingId(p.id); setTempProgress(p.progress); }} 
                            className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest hover:underline"
                          >
                            Update Work
                          </button>
                       )}
                    </div>

                    {editingId === p.id ? (
                       <input 
                         type="range" 
                         min="0" max="100" 
                         value={tempProgress} 
                         onChange={(e) => setTempProgress(parseInt(e.target.value))}
                         className="w-full h-1.5 bg-[var(--bg-raised)] rounded-full appearance-none cursor-pointer accent-[var(--accent)] mb-2"
                       />
                    ) : (
                       <div className="h-2 bg-[var(--bg-raised)] rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-[var(--accent)] transition-all duration-700" style={{ width: `${p.progress}%` }}></div>
                       </div>
                    )}
                 </div>
              </div>

            </div>
          ))) : (
            <div className="col-span-full py-24 text-center bg-[var(--glass-bg)] rounded-[40px] border border-[var(--border)]">
               <div className="text-5xl mb-6 grayscale opacity-20">📂</div>
               <p className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">No projects yet</p>
               <p className="text-xs text-[var(--text-muted)] font-medium italic">Let's create your first workspace to get the team started.</p>
               {isAdmin && (
                 <button onClick={() => setShowModal(true)} className="btn-primary mt-8 mx-auto">Create First Project</button>
               )}
            </div>
          )}
        </div>

        {/* Modal for Admin Creation */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] backdrop-blur-xl w-full max-w-md rounded-[40px] p-10 shadow-2xl text-[var(--text-primary)] animate-spring">
               <h2 className="text-2xl font-black mb-2">Start a new project</h2>
               <p className="text-sm text-[var(--text-muted)] mb-6">Create a shared workspace for your team.</p>
               <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    required
                    type="text"
                    placeholder="Project Name"
                    value={newProject.name}
                    onChange={e => setNewProject({...newProject, name: e.target.value})}
                    className="input-field"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    rows="2"
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    className="input-field resize-none h-auto p-4"
                  ></textarea>
                  <select
                    value={newProject.priority}
                    onChange={e => setNewProject({...newProject, priority: e.target.value})}
                    className="input-field cursor-pointer"
                  >
                    <option value="High" className="bg-[var(--bg-base)]">High Priority</option>
                    <option value="Moderate" className="bg-[var(--bg-base)]">Moderate Priority</option>
                    <option value="Low" className="bg-[var(--bg-base)]">Low Priority</option>
                  </select>

                  {/* Assign Members */}
                  <div>
                    <label className="block text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">
                      Assign Members
                    </label>
                    <div className="max-h-44 overflow-y-auto space-y-1 border border-[var(--border)] rounded-2xl p-3 bg-[var(--bg-raised)]">
                      {allUsers.length === 0 ? (
                        <p className="text-xs text-[var(--text-muted)] text-center py-3">No members available</p>
                      ) : (
                        allUsers.map(u => (
                          <label key={u.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-surface)] cursor-pointer transition-all">
                            <input
                              type="checkbox"
                              checked={newProject.memberIds.includes(u.id)}
                              onChange={() => toggleMember(u.id)}
                              className="accent-[var(--accent)] w-4 h-4 shrink-0"
                            />
                            <div className="w-7 h-7 rounded-lg bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[var(--text-primary)]">{u.name}</p>
                              <p className="text-[10px] text-[var(--text-muted)]">{u.role}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    {newProject.memberIds.length > 0 && (
                      <p className="text-[10px] text-[var(--accent)] font-bold mt-2 ml-1">{newProject.memberIds.length} member(s) selected</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-2">
                     <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-xs font-black uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Cancel</button>
                     <button type="submit" className="btn-primary flex-1">Create Project</button>
                  </div>
               </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
