import { useEffect, useState } from 'react';
import { getTasks, getProjects, updateTask, getUsers, createTask } from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const [allUsers, setAllUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchAllData = async () => {
    try {
      const fetchers = [getTasks(), getProjects()];
      if (user?.role === 'Admin') {
         fetchers.push(getUsers());
      }
      const results = await Promise.all(fetchers);
      setTasks(results[0].data.data || []);
      setProjects(results[1].data.data || []);
      if (user?.role === 'Admin') {
         setAllUsers(results[2].data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      alert('Update failed');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterProject('');
    setFilterStatus('');
    setFilterPriority('');
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const title = e.target.taskTitle.value;
    const assigneeId = e.target.assignee.value;
    const projectId = e.target.project.value;
    const priority = e.target.priority.value;
    if (!title || !assigneeId || !projectId) {
      alert("Please fill in Title, Project, and Assignee.");
      return;
    }
    try {
      await createTask({ title, assigneeId, projectId, priority, status: 'Todo' });
      const res = await getTasks();
      setTasks(res.data.data);
      e.target.reset();
      setShowCreateForm(false);
      alert('Task Created successfully.');
    } catch (err) {
      alert('Task creation failed.');
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesProject = !filterProject || t.projectId === filterProject;
    const matchesStatus = !filterStatus || t.status === filterStatus;
    const matchesPriority = !filterPriority || t.priority === filterPriority;
    return matchesSearch && matchesProject && matchesStatus && matchesPriority;
  });

  const isFiltering = search || filterProject || filterStatus || filterPriority;

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-12 lg:p-16 ml-[236px] animate-fade">
        <header className="mb-12 flex justify-between items-end animate-spring">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">My Tasks</h1>
            <p className="text-sm text-[var(--text-secondary)] font-medium">Keep track of what needs to be done.</p>
          </div>
          <div className="flex gap-4 items-end">
            {isFiltering && (
              <button type="button" onClick={clearFilters} className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest hover:underline mb-1">
                Clear All Filters
              </button>
            )}
            {user?.role === 'Admin' && (
              <button 
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="btn-primary"
              >
                {showCreateForm ? 'Cancel' : 'Add Task'}
              </button>
            )}
          </div>
        </header>

        {showCreateForm && (
           <div className="card p-8 mb-12 bg-[var(--bg-surface)] border border-[var(--border)] animate-spring">
              <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-6">Add a new task</h3>
              <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                  <div className="flex flex-col gap-1.5 lg:col-span-2">
                     <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1">Title</label>
                     <input name="taskTitle" type="text" placeholder="Task description..." className="input-field" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1">Project</label>
                     <select name="project" className="input-field cursor-pointer">
                        <option value="" className="bg-[var(--bg-base)]">Select...</option>
                        {projects.map(p => <option key={p.id} value={p.id} className="bg-[var(--bg-base)]">{p.name}</option>)}
                     </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1">Assignee</label>
                     <select name="assignee" className="input-field cursor-pointer">
                        <option value="" className="bg-[var(--bg-base)]">Select...</option>
                        {allUsers.map(u => <option key={u.id} value={u.id} className="bg-[var(--bg-base)]">{u.name}</option>)}
                     </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1">Priority</label>
                     <select name="priority" className="input-field cursor-pointer">
                        <option value="Medium" className="bg-[var(--bg-base)]">Medium</option>
                        <option value="High" className="bg-[var(--bg-base)]">High</option>
                        <option value="Low" className="bg-[var(--bg-base)]">Low</option>
                     </select>
                  </div>
                  <div className="lg:col-span-5 flex justify-end mt-2">
                     <button type="submit" className="btn-primary">Submit Task</button>
                  </div>
              </form>
           </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 mb-12 animate-spring delay-75">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12 pr-6"
            />
          </div>
          
          <div className="flex gap-3">
             <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="h-12 px-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)] outline-none focus:border-[var(--accent)] cursor-pointer shadow-sm">
               <option value="" className="bg-[var(--bg-base)]">All Projects</option>
               {projects.map(p => <option key={p.id} value={p.id} className="bg-[var(--bg-base)]">{p.name}</option>)}
             </select>

             <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-12 px-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)] outline-none focus:border-[var(--accent)] cursor-pointer shadow-sm">
               <option value="" className="bg-[var(--bg-base)]">All Status</option>
               <option value="To Do" className="bg-[var(--bg-base)]">To Do</option>
               <option value="In Progress" className="bg-[var(--bg-base)]">In Progress</option>
               <option value="Completed" className="bg-[var(--bg-base)]">Completed</option>
             </select>

             <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="h-12 px-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)] outline-none focus:border-[var(--accent)] cursor-pointer shadow-sm">
               <option value="" className="bg-[var(--bg-base)]">All Priority</option>
               <option value="High" className="bg-[var(--bg-base)]">High</option>
               <option value="Medium" className="bg-[var(--bg-base)]">Medium</option>
               <option value="Low" className="bg-[var(--bg-base)]">Low</option>
             </select>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-20 bg-[var(--glass-bg)] border border-[var(--border)] rounded-2xl animate-pulse" />)
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((t, index) => (
              <div key={t.id} className="card p-6 bg-[var(--glass-bg)] border border-[var(--border)] flex items-center justify-between group hover:border-[var(--accent-dim)] hover:shadow-lg hover:shadow-[var(--accent)]/5 transition-all duration-300 animate-spring" style={{ animationDelay: `${index * 75}ms` }}>
                <div className="flex items-center gap-5">
                   <button 
                     onClick={() => handleStatusChange(t.id, t.status === 'Completed' ? 'To Do' : 'Completed')}
                     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                       t.status === 'Completed' ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border)] hover:border-[var(--accent)]'
                     }`}
                   >
                     {t.status === 'Completed' && <svg className="w-3 h-3 animate-spring" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                   </button>
                   <div>
                      <p className={`text-sm font-bold ${t.status === 'Completed' ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>{t.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{t.project?.name || 'No Project'} • {t.assignedTo?.name || 'Unassigned'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-6">
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t.priority === 'High' ? 'bg-[var(--red-dim)] text-[var(--red)]' : 'bg-[var(--bg-raised)] text-[var(--text-muted)]'}`}>
                      {t.priority}
                   </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center bg-[var(--glass-bg)] rounded-[40px] border border-[var(--border)]">
               <div className="text-5xl mb-6 grayscale opacity-20">🎯</div>
               <p className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">You're all caught up!</p>
               <p className="text-xs text-[var(--text-muted)] font-medium italic">Enjoy your day, or adjust your filters if you're looking for something specific.</p>
               {isFiltering && (
                 <button type="button" onClick={clearFilters} className="btn-primary mt-8 mx-auto">Reset Filters</button>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
