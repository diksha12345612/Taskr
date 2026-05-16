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
    <div className="flex h-screen bg-[#f8fafc] text-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-12 lg:p-16 ml-[236px] animate-fade">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Projects</h1>
            <p className="text-sm text-slate-500 font-medium">Strategic initiatives and team workspaces.</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
              New Project
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
          {loading ? (
            [1,2].map(i => <div key={i} className="h-80 bg-white rounded-[40px] animate-pulse border border-slate-100" />)
          ) : projects.length > 0 ? (
            projects.map(p => (
            <div key={p.id} className="card p-10 bg-white border border-slate-100 group hover:border-blue-100 transition-all relative overflow-hidden flex flex-col">
              
              <div className="flex justify-between items-start mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">📂</div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">{p.name}</h3>
                       <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                         p.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                       }`}>
                          {p.priority} Priority
                       </span>
                    </div>
                 </div>
                 {isAdmin && (
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                 )}
              </div>

              <div className="mb-10">
                 <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{p.description || 'Onboarding this initiative into the active workspace.'}</p>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">In Sync</span>
                 </div>
              </div>

              <div className="mt-auto space-y-8">
                 <div className="pt-8 border-t border-slate-50">
                    <div className="flex justify-between items-end mb-4">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Status</p>
                          <p className="text-2xl font-black text-blue-600">{editingId === p.id ? tempProgress : p.progress}%</p>
                       </div>
                       {editingId === p.id ? (
                         <div className="flex gap-2">
                            <button onClick={() => handleUpdateProgress(p.id)} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl">Save</button>
                            <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-100 text-slate-400 text-[10px] font-black uppercase rounded-xl">Cancel</button>
                         </div>
                       ) : (
                         <button 
                           onClick={() => { setEditingId(p.id); setTempProgress(p.progress); }} 
                           className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
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
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 mb-2"
                      />
                    ) : (
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                         <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${p.progress}%` }}></div>
                      </div>
                    )}
                 </div>
              </div>

            </div>
          ))) : (
            <div className="col-span-full py-24 text-center bg-white rounded-[40px] border border-slate-100">
               <div className="text-5xl mb-6 grayscale opacity-20">📂</div>
               <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">No Projects Found</p>
               <p className="text-xs text-slate-400 font-medium italic">There are currently no active projects in the workspace.</p>
               {isAdmin && (
                 <button onClick={() => setShowModal(true)} className="mt-8 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20">Create First Project</button>
               )}
            </div>
          )}
        </div>

        {/* Modal for Admin Creation */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-fade">
               <h2 className="text-2xl font-black mb-6">New Project</h2>
               <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    required
                    type="text"
                    placeholder="Project Name"
                    value={newProject.name}
                    onChange={e => setNewProject({...newProject, name: e.target.value})}
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm outline-none focus:border-blue-600"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    rows="2"
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-blue-600 resize-none"
                  ></textarea>
                  <select
                    value={newProject.priority}
                    onChange={e => setNewProject({...newProject, priority: e.target.value})}
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="High">High Priority</option>
                    <option value="Moderate">Moderate Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>

                  {/* Assign Members */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Assign Members
                    </label>
                    <div className="max-h-44 overflow-y-auto space-y-1 border border-slate-100 rounded-2xl p-3 bg-slate-50">
                      {allUsers.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-3">No members available</p>
                      ) : (
                        allUsers.map(u => (
                          <label key={u.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white cursor-pointer transition-all">
                            <input
                              type="checkbox"
                              checked={newProject.memberIds.includes(u.id)}
                              onChange={() => toggleMember(u.id)}
                              className="accent-blue-600 w-4 h-4 shrink-0"
                            />
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{u.name}</p>
                              <p className="text-[10px] text-slate-400">{u.role}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    {newProject.memberIds.length > 0 && (
                      <p className="text-[10px] text-blue-600 font-bold mt-2 ml-1">{newProject.memberIds.length} member(s) selected</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-2">
                     <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                     <button type="submit" className="flex-1 h-12 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Launch Project</button>
                  </div>
               </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
