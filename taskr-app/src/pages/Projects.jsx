import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProjects, getUsers, createProject, deleteProject } from '../services/api';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    memberIds: []
  });

  const fetchData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        getProjects(),
        getUsers()
      ]);
      setProjects(projRes.data.data || []);
      setAllUsers(userRes.data.data || []);
    } catch {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete project');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createProject(newProject);
      setProjects([...projects, res.data.data]);
      setShowModal(false);
      setNewProject({ name: '', description: '', memberIds: [] });
      alert('Awesome! Your new project has been launched. 🚀');
    } catch {
      alert('Oops! Something went wrong. Let\'s try creating it again.');
    }
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'All') return true;
    return p.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pl-[236px]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-10">
        <header className="flex items-center justify-between mb-12" style={{ animation: 'springIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="text-3xl">🚀</span>
               <h1 className="text-[32px] font-[800] tracking-tight">Projects</h1>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] font-medium">Coordinate and track your team's big initiatives.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowModal(true)}
              className="h-[48px] px-8 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[14px] font-bold rounded-2xl transition-all shadow-lg shadow-[var(--accent-dim)] transform active:scale-95"
            >
              Start New Project
            </button>
          )}
        </header>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-10" style={{ animation: 'springIn 0.8s ease 0.1s both' }}>
          {['All', 'Active', 'Review', 'Hold'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-2xl text-[12px] font-[800] transition-all border shadow-sm ${
                filter === f 
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-md' 
                  : 'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="pb-12" style={{ animation: 'springIn 0.8s ease 0.2s both' }}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[240px] glass-card animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="relative group">
                <ProjectCard {...project} />
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="absolute top-6 right-6 p-2 text-[var(--text-faint)] hover:text-[var(--red)] hover:bg-[var(--red-dim)] rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center glass-card">
            <div className="w-20 h-20 bg-[var(--bg-raised)] rounded-[32px] flex items-center justify-center mb-6 border border-[var(--glass-border)]">
              <svg className="w-10 h-10 text-[var(--text-faint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-[18px] font-[800] text-[var(--text-primary)] mb-2">No projects yet</h3>
            <p className="text-[14px] text-[var(--text-muted)] max-w-[280px] mb-10 font-medium">Start by creating your first team initiative to get things moving.</p>
            {isAdmin && (
              <button 
                onClick={() => setShowModal(true)}
                className="px-10 py-3 bg-[var(--accent)] text-white text-[14px] font-[800] rounded-2xl hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent-dim)]"
              >
                Launch your first project
              </button>
            )}
          </div>
        )}
        </div>

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-6">
            <div 
              className="bg-[var(--bg-surface)] border border-[var(--glass-border)] w-full max-w-[500px] rounded-[32px] p-10 shadow-2xl relative"
              style={{ animation: 'springIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <h2 className="text-[24px] font-[800] mb-2">New Project</h2>
              <p className="text-[14px] text-[var(--text-muted)] mb-10 font-medium">Set up a new workspace for your team goals.</p>

              <form onSubmit={handleCreate} className="space-y-8">
                <div>
                  <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Project Name</label>
                  <input 
                    required
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                    placeholder="e.g. Q4 Growth Strategy"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Description</label>
                  <textarea 
                    rows="3"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all resize-none shadow-inner"
                    placeholder="What is this project about?"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-[56px] bg-[var(--bg-raised)] text-[var(--text-primary)] text-[14px] font-bold rounded-2xl hover:bg-[var(--border)] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 h-[56px] bg-[var(--accent)] text-white text-[14px] font-[800] rounded-2xl hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent-dim)]"
                  >
                    Launch Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
