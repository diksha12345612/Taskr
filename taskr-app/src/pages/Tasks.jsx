import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, getProjects, getUsers, createTask, deleteTask, updateTaskStatus } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    project: 'All',
    status: 'All',
    priority: 'All',
    search: ''
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    assigneeId: '',
    dueDate: '',
    priority: 'Medium'
  });

  useEffect(() => {
    (async () => {
      try {
        const [tasksRes, projectsRes, usersRes] = await Promise.all([
          getTasks(),
          getProjects(),
          getUsers()
        ]);
        setTasks(tasksRes.data.data || []);
        setProjects(projectsRes.data.data || []);
        setUsers(usersRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch tasks data', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const prevTasks = [...tasks];
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await updateTaskStatus(id, newStatus);
    } catch {
      setTasks(prevTasks);
      alert('Oops! Failed to update the status. Let\'s try that again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this task? It will be gone forever!')) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch {
      alert('Failed to delete task');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createTask(newTask);
      setTasks([...tasks, res.data]);
      setShowModal(false);
      setNewTask({ title: '', description: '', projectId: '', assigneeId: '', dueDate: '', priority: 'Medium' });
      alert('Great! Your new task has been created.');
    } catch {
      alert('Failed to create task');
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchProject = filters.project === 'All' || t.projectId === filters.project;
    const matchStatus = filters.status === 'All' || t.status === filters.status;
    const matchPriority = filters.priority === 'All' || t.priority === filters.priority;
    const matchSearch = t.title.toLowerCase().includes(filters.search.toLowerCase());
    return matchProject && matchStatus && matchPriority && matchSearch;
  });

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pl-[236px]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden p-10">
        <header className="mb-10 flex items-center justify-between" style={{ animation: 'springIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">📋</span>
              <h1 className="text-[32px] font-[800] tracking-tight">Tasks</h1>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] font-medium">Keep track of everything your team is working on.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowModal(true)}
              className="h-[48px] px-8 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[14px] font-bold rounded-2xl transition-all shadow-lg shadow-[var(--accent-dim)] transform active:scale-95"
            >
              Add a Task
            </button>
          )}
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8" style={{ animation: 'springIn 0.8s ease 0.1s both' }}>
          <div className="relative flex-1 max-w-[320px]">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Search by task name..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-3 text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all shadow-sm"
            />
          </div>

          <select 
            value={filters.project}
            onChange={(e) => setFilters({...filters, project: e.target.value})}
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl px-5 py-3 text-[13px] font-bold text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] transition-all shadow-sm"
          >
            <option value="All">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <div className="flex glass-card p-1">
            {['All', 'Todo', 'InProgress', 'Completed'].map(s => (
              <button
                key={s}
                onClick={() => setFilters({...filters, status: s})}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
                  filters.status === s ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {s === 'InProgress' ? 'Doing' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2" style={{ animation: 'springIn 0.8s ease 0.2s both' }}>
          <div className="space-y-4 pb-10">
            {loading ? Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-24 glass-card animate-pulse" />
            )) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const isOverdue = task.status !== 'Completed' && new Date(task.dueDate) < new Date();
                return (
                  <div 
                    key={task.id} 
                    className="glass-card p-6 flex items-center justify-between group hover:translate-y-[-4px] transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <button 
                        onClick={() => handleStatusUpdate(task.id, task.status === 'Completed' ? 'Todo' : 'Completed')}
                        className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          task.status === 'Completed' 
                            ? 'bg-[var(--green)] border-[var(--green)] text-white shadow-lg shadow-[var(--green-dim)]' 
                            : 'border-[var(--border-hover)] hover:border-[var(--accent)]'
                        }`}
                      >
                        {task.status === 'Completed' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" /></svg>}
                      </button>

                      <div className="min-w-0 pr-8">
                        <h3 className={`text-[16px] font-bold truncate mb-1 transition-all ${task.status === 'Completed' ? 'text-[var(--text-muted)] line-through' : ''}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-black text-[var(--accent)] uppercase tracking-widest">
                            {projects.find(p => p.id === task.projectId)?.name || 'General'}
                          </span>
                          <span className={`text-[11px] font-black uppercase tracking-widest ${isOverdue ? 'text-[var(--red)]' : 'text-[var(--text-faint)]'}`}>
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                            {users.find(u => u.id === task.assigneeId)?.name?.[0] || 'U'}
                         </div>
                         <span className="text-[12px] font-bold text-[var(--text-secondary)] hidden sm:block">
                            {users.find(u => u.id === task.assigneeId)?.name?.split(' ')[0] || 'Unassigned'}
                         </span>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        task.priority === 'High' ? 'text-[var(--red)] bg-[var(--red-dim)]' : 
                        task.priority === 'Medium' ? 'text-[var(--amber)] bg-[var(--amber-dim)]' : 
                        'text-[var(--green)] bg-[var(--green-dim)]'
                      }`}>
                        {task.priority}
                      </span>

                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(task.id)}
                          className="p-2.5 text-[var(--text-faint)] hover:text-[var(--red)] hover:bg-[var(--red-dim)] rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-24 glass-card">
                 <p className="text-[15px] font-medium text-[var(--text-muted)] italic">Looks like your list is clear! Enjoy the break. ☕</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <div 
              className="bg-[var(--bg-surface)] border border-[var(--glass-border)] w-full max-w-[520px] rounded-[32px] p-10 shadow-2xl relative"
              style={{ animation: 'springIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <h2 className="text-[24px] font-[800] mb-2">New Task</h2>
              <p className="text-[14px] text-[var(--text-muted)] mb-10 font-medium">Add a new beat to your project's rhythm.</p>

              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">What needs to be done?</label>
                  <input required type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all shadow-inner" placeholder="e.g. Design the user profile experience" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Project</label>
                    <select required value={newTask.projectId} onChange={(e) => setNewTask({...newTask, projectId: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all">
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Who's on it?</label>
                    <select required value={newTask.assigneeId} onChange={(e) => setNewTask({...newTask, assigneeId: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all">
                      <option value="">Assign Member</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Due Date</label>
                    <input required type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] mb-3 ml-1">Priority</label>
                    <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl p-4 text-[14px] outline-none focus:border-[var(--accent)] transition-all">
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-[56px] bg-[var(--bg-raised)] text-[var(--text-primary)] text-[14px] font-bold rounded-2xl hover:bg-[var(--border)] transition-all">Cancel</button>
                  <button type="submit" className="flex-1 h-[56px] bg-[var(--accent)] text-white text-[14px] font-[800] rounded-2xl hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent-dim)]">Launch Task</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
