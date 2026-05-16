import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getProjects, getTasks, getDashboardStats, getMyAttendance, 
  getMyLeaves, getUsers, createTask, getAllLeaves, updateLeaveStatus 
} from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    (async () => {
      try {
        const fetchers = [getProjects(), getTasks(), getDashboardStats()];
        if (isAdmin) {
          fetchers.push(getUsers(), getAllLeaves());
        } else {
          fetchers.push(getMyAttendance(), getMyLeaves());
        }
        
        const results = await Promise.all(fetchers);
        setProjects(results[0].data.data || []);
        setTasks(results[1].data.data || []);
        setStatsData(results[2].data.data);
        
        if (isAdmin) {
          setAllUsers(results[3].data.data || []);
          const allL = results[4].data.data || [];
          setPendingLeaves(allL.filter(l => l.status === 'Pending'));
        } else {
          setMyAttendance(results[3].data.data || []);
          setMyLeaves(results[4].data.data || []);
        }
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    })();
    return () => clearInterval(timer);
  }, [isAdmin]);

  const handleLeaveAction = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      setPendingLeaves(prev => prev.filter(l => l.id !== id));
      alert(`Status updated to ${status}.`);
    } catch (err) {
      alert('Action failed.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const title = e.target.taskTitle.value;
    const assigneeId = e.target.assignee.value;
    const projectId = e.target.project.value;
    if (!title || !assigneeId || !projectId) {
      alert("Please fill in all fields (Title, Project, Assignee).");
      return;
    }
    try {
      await createTask({ title, assigneeId, projectId, priority: 'Medium', status: 'Todo' });
      const res = await getTasks();
      setTasks(res.data.data);
      e.target.reset();
      alert('Task Dispatched.');
    } catch (err) {
      alert('Dispatch failed.');
    }
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc] text-blue-600 font-bold uppercase text-[10px] tracking-[0.2em] animate-pulse">Establishing Secure Uplink...</div>;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-12 lg:p-16 ml-[236px] animate-fade">
        
        {/* ACTUAL HEADER: DAILY HUB */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div>
              <div className="flex items-center gap-3 mb-3">
                 <div className="px-2 py-1 bg-blue-600 rounded text-[9px] font-black text-white uppercase">Operational</div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                 </p>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                 {isAdmin ? 'Management Hub' : `Welcome, ${user?.name.split(' ')[0]}`}
              </h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                 <p className="text-2xl font-black text-slate-900 leading-none">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Local Terminal Time</p>
              </div>
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm relative">
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                 <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
           </div>
        </header>

        {isAdmin ? (
          <div className="space-y-8">
            
            {/* ASSIGNMENT REQUIRED DASHBOARD METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="card p-6 bg-blue-600 text-white border-none shadow-xl shadow-blue-600/30">
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-2">Total Tasks</p>
                  <p className="text-4xl font-black mb-1">{statsData?.totalTasks || 0}</p>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Across All Projects</p>
               </div>
               
               <div className="card p-6 bg-red-50 border border-red-100 shadow-sm">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Overdue Tasks</p>
                  <p className="text-4xl font-black text-red-600 mb-1">{statsData?.overdueTasks || 0}</p>
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Requires Attention</p>
               </div>

               <div className="card p-6 bg-emerald-50 border border-emerald-100 shadow-sm md:col-span-2">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Tasks By Status</p>
                  <div className="flex justify-between items-end mt-4">
                     <div className="text-center">
                        <p className="text-2xl font-black text-emerald-700">{statsData?.tasksByStatus?.Todo || 0}</p>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">To Do</p>
                     </div>
                     <div className="text-center">
                        <p className="text-2xl font-black text-emerald-700">{statsData?.tasksByStatus?.InProgress || 0}</p>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">In Progress</p>
                     </div>
                     <div className="text-center">
                        <p className="text-2xl font-black text-emerald-700">{statsData?.tasksByStatus?.Completed || 0}</p>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Done</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* TASKS PER USER (ASSIGNMENT REQUIREMENT) */}
            <div className="card p-8 bg-white border border-slate-200">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Tasks Per User</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statsData?.tasksPerUser?.map(u => (
                     <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                              {u.name.charAt(0)}
                           </div>
                           <p className="text-sm font-bold text-slate-900">{u.name}</p>
                        </div>
                        <span className="text-sm font-black text-blue-600">{u._count?.assignedTasks || 0} Tasks</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* 2. MANAGEMENT HUB */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="card p-10 bg-white border border-slate-200">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Dispatch New Task</h3>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Task Specification</label>
                        <input name="taskTitle" type="text" placeholder="e.g. Design System Review" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm outline-none focus:border-blue-600 transition-all" />
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Project</label>
                        <select name="project" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm outline-none focus:border-blue-600 cursor-pointer">
                           <option value="">Select Project</option>
                           {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Assigned Agent</label>
                        <select name="assignee" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm outline-none focus:border-blue-600 cursor-pointer">
                           <option value="">Select Member</option>
                           {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                     </div>
                     <button type="submit" className="w-full h-12 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all">Submit Assignment</button>
                  </form>
               </div>

               <div className="card p-10 bg-white border border-slate-200 overflow-hidden">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Live System Activity</h3>
                  <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2">
                     {tasks.slice(0, 5).map(t => (
                       <div key={t.id} className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                             {t.assignedTo?.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-sm font-bold text-slate-900 truncate">{t.title}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.assignedTo?.name || 'Unassigned'} • {t.status}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${t.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          /* ACTUAL MEMBER VIEW: THE DAILY HUB */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Main Feed */}
             <div className="lg:col-span-2 space-y-8">
                <div className="card p-12 bg-white border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-3xl animate-bounce">🎯</div>
                   </div>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Morning Briefing</p>
                   <h2 className="text-3xl font-black mb-6 tracking-tighter text-slate-900 max-w-md">
                      You have {tasks.filter(t => t.status !== 'Completed').length} active tasks scheduled for today.
                   </h2>
                   
                   {/* Real tasks list for members */}
                   <div className="space-y-4 mb-8 mt-6">
                      {tasks.filter(t => t.status !== 'Completed').slice(0, 3).map(t => (
                        <div key={t.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <div className={`w-3 h-3 rounded-full ${t.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{t.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.project?.name || 'Unassigned'} • {t.priority} Priority</p>
                           </div>
                           <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">{t.status}</span>
                        </div>
                      ))}
                   </div>

                   <div className="flex gap-4">
                      <Link to="/tasks" className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">View Roadmap</Link>
                      <Link to="/attendance" className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Daily Check-In</Link>
                   </div>
                </div>

                <div className="card p-10 bg-white border border-slate-200">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">Assigned Workspace</h3>
                   <div className="space-y-6">
                      {projects.length > 0 ? projects.slice(0, 3).map(p => (
                        <div key={p.id} className="group p-6 bg-slate-50/50 border border-transparent hover:border-blue-100 hover:bg-white rounded-[32px] transition-all">
                           <div className="flex justify-between items-center mb-4">
                              <div>
                                 <span className="text-base font-black text-slate-900 block">{p.name}</span>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Development</span>
                              </div>
                              <span className="text-sm font-black text-blue-600">{p.progress}%</span>
                           </div>
                           <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 shadow-lg shadow-blue-600/30" style={{ width: `${p.progress}%` }}></div>
                           </div>
                        </div>
                      )) : (
                        <p className="text-sm text-slate-400 font-medium italic">You are not assigned to any projects currently.</p>
                      )}
                   </div>
                </div>
             </div>

             {/* Right Sidebar Widgets */}
             <div className="space-y-8">
                <div className="card p-8 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                   <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Performance Hub</h3>
                   <div className="flex items-center gap-6 mb-8">
                      <div className="flex-1">
                         <p className="text-4xl font-black mb-1">
                            {statsData?.totalTasks > 0 ? Math.round(((statsData?.tasksByStatus?.Completed || 0) / statsData.totalTasks) * 100) : 0}%
                         </p>
                         <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Completion</p>
                      </div>
                      <div className="flex-1">
                         <p className="text-4xl font-black mb-1">{statsData?.totalTasks || 0}</p>
                         <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Total Tasks</p>
                      </div>
                   </div>
                   <Link to="/attendance" className="block w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">Mark Presence</Link>
                </div>

                <div className="card p-8 bg-white border border-slate-200 shadow-sm">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Leave Ecosystem</h3>
                   <div className="flex items-end justify-between mb-8">
                      <div>
                         <p className="text-4xl font-black text-slate-900">
                           {20 - myLeaves.filter(l => l.status === 'Approved').reduce((acc, curr) => {
                             const diffTime = Math.abs(new Date(curr.endDate) - new Date(curr.startDate));
                             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                             return acc + diffDays;
                           }, 0)}
                         </p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Balance Days</p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-xl">🌴</div>
                   </div>
                   <Link to="/leaves" className="block w-full py-4 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 text-center hover:bg-slate-50 transition-all">Request Time Off</Link>
                </div>
             </div>

          </div>
        )}
      </main>
    </div>
  );
}
