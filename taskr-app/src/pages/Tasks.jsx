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
    <div className="flex h-screen bg-[#f8fafc] text-slate-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-12 lg:p-16 ml-[236px] animate-fade">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Tasks</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and track your team's workload.</p>
          </div>
          <div className="flex gap-4 items-end">
            {isFiltering && (
              <button onClick={clearFilters} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline mb-1">
                Clear All Filters
              </button>
            )}
            {user?.role === 'Admin' && (
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all"
              >
                {showCreateForm ? 'Cancel' : 'Add Task'}
              </button>
            )}
          </div>
        </header>

        {showCreateForm && (
           <div className="card p-8 mb-12 bg-white border border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Create New Task</h3>
              <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                 <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Title</label>
                    <input name="taskTitle" type="text" placeholder="Task description..." className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm outline-none focus:border-emerald-600 transition-all" />
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Project</label>
                    <select name="project" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm outline-none focus:border-emerald-600 cursor-pointer">
                       <option value="">Select...</option>
                       {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Assignee</label>
                    <select name="assignee" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm outline-none focus:border-emerald-600 cursor-pointer">
                       <option value="">Select...</option>
                       {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Priority</label>
                    <select name="priority" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm outline-none focus:border-emerald-600 cursor-pointer">
                       <option value="Medium">Medium</option>
                       <option value="High">High</option>
                       <option value="Low">Low</option>
                    </select>
                 </div>
                 <div className="lg:col-span-5 flex justify-end mt-2">
                    <button type="submit" className="px-8 h-12 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all">Submit Task</button>
                 </div>
              </form>
           </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 mb-12">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-white border border-slate-200 rounded-2xl pl-12 pr-6 text-sm outline-none focus:border-blue-600 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex gap-3">
             <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="h-12 px-5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none focus:border-blue-600 cursor-pointer shadow-sm">
               <option value="">All Projects</option>
               {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>

             <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-12 px-5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none focus:border-blue-600 cursor-pointer shadow-sm">
               <option value="">All Status</option>
               <option value="To Do">To Do</option>
               <option value="In Progress">In Progress</option>
               <option value="Completed">Completed</option>
             </select>

             <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="h-12 px-5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none focus:border-blue-600 cursor-pointer shadow-sm">
               <option value="">All Priority</option>
               <option value="High">High</option>
               <option value="Medium">Medium</option>
               <option value="Low">Low</option>
             </select>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map(t => (
              <div key={t.id} className="card p-6 bg-white border border-slate-100 flex items-center justify-between group hover:shadow-lg transition-all">
                <div className="flex items-center gap-5">
                   <button 
                     onClick={() => handleStatusChange(t.id, t.status === 'Completed' ? 'To Do' : 'Completed')}
                     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                       t.status === 'Completed' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 hover:border-blue-600'
                     }`}
                   >
                     {t.status === 'Completed' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                   </button>
                   <div>
                      <p className={`text-sm font-bold ${t.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{t.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.project?.name || 'No Project'} • {t.assignedTo?.name || 'Unassigned'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-6">
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                      {t.priority}
                   </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center">
               <div className="text-5xl mb-6 grayscale opacity-20">📂</div>
               <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">No Tasks Found</p>
               <p className="text-xs text-slate-400 font-medium italic">Adjust your search or filters to see results.</p>
               {isFiltering && (
                 <button onClick={clearFilters} className="mt-8 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20">Reset Filters</button>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
