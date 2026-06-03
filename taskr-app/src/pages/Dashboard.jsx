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
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
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

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[var(--bg-base)] text-[var(--accent)] font-bold uppercase text-[10px] tracking-[0.2em] animate-pulse">Establishing Secure Uplink...</div>;

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-dim)]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-12 lg:p-16 ml-[236px] animate-fade">
        
        {/* ACTUAL HEADER: DAILY HUB */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-spring">
           <div>
              <div className="flex items-center gap-3 mb-3">
                 <div className="px-2 py-1 bg-[var(--accent)] rounded-lg text-[9px] font-black text-white uppercase tracking-widest">All systems go</div>
                 <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                 </p>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">
                 {isAdmin ? `${getGreeting()}, Admin!` : `${getGreeting()}, ${user?.name.split(' ')[0]}!`}
              </h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                 <p className="text-2xl font-black text-[var(--text-primary)] leading-none">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                 <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Local Terminal Time</p>
              </div>
              <div className="w-12 h-12 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl flex items-center justify-center shadow-sm relative hover:scale-105 transition-transform duration-300">
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-surface)]"></span>
                 <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
           </div>
        </header>

        {isAdmin ? (
          <div className="space-y-8">
            
            {/* ASSIGNMENT REQUIRED DASHBOARD METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="card p-6 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-white border-none shadow-xl shadow-[var(--accent)]/20 hover:scale-[1.02] transition-all duration-300 animate-spring">
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-2">Total Tasks</p>
                  <p className="text-4xl font-black mb-1">{statsData?.totalTasks || 0}</p>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Across All Projects</p>
               </div>
               
               <div className="card p-6 bg-[var(--red-dim)] border border-[var(--red)]/20 shadow-sm hover:scale-[1.02] transition-all duration-300 animate-spring delay-100">
                  <p className="text-[10px] font-black text-[var(--red)] uppercase tracking-widest mb-2">Overdue Tasks</p>
                  <p className="text-4xl font-black text-[var(--red)] mb-1">{statsData?.overdueTasks || 0}</p>
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Requires Attention</p>
               </div>

               <div className="card p-6 bg-[var(--accent-dim)] border border-[var(--accent)]/20 shadow-sm md:col-span-2 hover:scale-[1.02] transition-all duration-300 animate-spring delay-200">
                  <p className="text-[10px] font-black text-[var(--accent-secondary)] uppercase tracking-widest mb-2">Tasks By Status</p>
                  <div className="flex justify-between items-end mt-4">
                      <div className="text-center">
                         <p className="text-2xl font-black text-[var(--text-primary)]">{statsData?.tasksByStatus?.Todo || 0}</p>
                         <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">To Do</p>
                      </div>
                      <div className="text-center">
                         <p className="text-2xl font-black text-[var(--text-primary)]">{statsData?.tasksByStatus?.InProgress || 0}</p>
                         <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">In Progress</p>
                      </div>
                      <div className="text-center">
                         <p className="text-2xl font-black text-[var(--text-primary)]">{statsData?.tasksByStatus?.Completed || 0}</p>
                         <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Done</p>
                      </div>
                  </div>
               </div>
            </div>

            {/* TASKS PER USER (ASSIGNMENT REQUIREMENT) */}
            <div className="card p-8 bg-[var(--bg-surface)] border border-[var(--border)] animate-spring delay-300">
               <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-6">Tasks Per User</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statsData?.tasksPerUser?.map((u, i) => (
                     <div key={u.id} className="flex items-center justify-between p-4 bg-[var(--bg-raised)] rounded-xl border border-[var(--border)] hover:border-[var(--accent-dim)] hover:translate-y-[-2px] transition-all duration-300">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center font-bold text-xs">
                              {u.name?.charAt(0) || '?'}
                           </div>
                           <p className="text-sm font-bold text-[var(--text-primary)]">{u.name || 'Unknown'}</p>
                        </div>
                        <span className="text-sm font-black text-[var(--accent)]">{u._count?.assignedTasks || 0} Tasks</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* 2. MANAGEMENT HUB */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="card p-10 bg-[var(--bg-surface)] border border-[var(--border)] animate-spring delay-400">
                  <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-8">Assign a new task</h3>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1">What needs to be done?</label>
                        <input name="taskTitle" type="text" placeholder="e.g. Design System Review" className="input-field h-12" />
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1">Project</label>
                        <select name="project" className="input-field h-12 cursor-pointer">
                           <option value="" className="bg-[var(--bg-base)]">Select a project</option>
                           {projects.map(p => <option key={p.id} value={p.id} className="bg-[var(--bg-base)]">{p.name}</option>)}
                        </select>
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1">Who will do it?</label>
                        <select name="assignee" className="input-field h-12 cursor-pointer">
                           <option value="" className="bg-[var(--bg-base)]">Select a team member</option>
                           {allUsers.map(u => <option key={u.id} value={u.id} className="bg-[var(--bg-base)]">{u.name}</option>)}
                        </select>
                     </div>
                     <button type="submit" className="btn-primary w-full mt-2">Assign Task</button>
                  </form>
               </div>

               <div className="card p-10 bg-[var(--bg-surface)] border border-[var(--border)] overflow-hidden animate-spring delay-450">
                  <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-8">Recent Activity</h3>
                  <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2">
                     {tasks.slice(0, 5).map(t => (
                       <div key={t.id} className="flex items-center gap-4 group hover:translate-x-1 transition-transform duration-300">
                          <div className="w-10 h-10 rounded-xl bg-[var(--bg-raised)] flex items-center justify-center text-sm font-bold text-[var(--text-muted)] group-hover:bg-[var(--accent-dim)] group-hover:text-[var(--accent)] transition-all">
                             {t.assignedTo?.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-sm font-bold text-[var(--text-primary)] truncate">{t.title}</p>
                             <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{t.assignedTo?.name || 'Unassigned'} • {t.status}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${t.status === 'Completed' ? 'bg-[var(--green)]' : 'bg-[var(--accent)]'}`}></div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>         ) : (
          /* ACTUAL MEMBER VIEW: THE DAILY HUB */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Main Feed */}
             <div className="lg:col-span-2 space-y-8">
                <div className="card p-12 relative overflow-hidden group animate-spring">
                   <div className="absolute top-0 right-0 p-8">
                      <div className="w-20 h-20 bg-[var(--accent-dim)] rounded-full flex items-center justify-center text-3xl animate-bounce">🎯</div>
                   </div>
                   <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-4">Your Daily Digest</p>
                   <h2 className="text-3xl font-black mb-6 tracking-tighter text-[var(--text-primary)] max-w-md">
                      You have {tasks.filter(t => t.status !== 'Completed').length} active tasks on your plate today.
                   </h2>
                   
                   {/* Real tasks list for members */}
                   <div className="space-y-4 mb-8 mt-6">
                      {tasks.filter(t => t.status !== 'Completed').slice(0, 3).map((t, index) => (
                        <div key={t.id} className="flex items-center gap-4 bg-[var(--bg-raised)] p-4 rounded-2xl border border-[var(--border)] hover:translate-y-[-2px] transition-transform duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                           <div className={`w-3 h-3 rounded-full ${t.priority === 'High' ? 'bg-[var(--red)]' : 'bg-[var(--accent)]'}`}></div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[var(--text-primary)] truncate">{t.title}</p>
                              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{t.project?.name || 'Unassigned'} • {t.priority} Priority</p>
                           </div>
                           <span className="text-[10px] font-black text-[var(--accent)] uppercase bg-[var(--accent-dim)] px-2 py-1 rounded">{t.status}</span>
                        </div>
                      ))}
                   </div>

                   <div className="flex gap-4 mt-6">
                      <Link to="/tasks" className="btn-primary">View my tasks</Link>
                      <Link to="/attendance" className="px-8 py-3 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-2xl text-[12px] font-bold transition-all hover:bg-[var(--bg-raised)] hover:scale-105 active:scale-95 flex items-center justify-center">Check-In</Link>
                   </div>
                </div>

                <div className="card p-10 animate-spring delay-200">
                   <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-10">Your Projects</h3>
                   <div className="space-y-6">
                      {projects.length > 0 ? projects.slice(0, 3).map(p => (
                        <div key={p.id} className="group p-6 bg-[var(--bg-raised)]/50 border border-transparent hover:border-[var(--accent-dim)] hover:bg-[var(--bg-surface)] rounded-[32px] transition-all">
                           <div className="flex justify-between items-center mb-4">
                              <div>
                                 <span className="text-base font-black text-[var(--text-primary)] block">{p.name}</span>
                                 <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Active Development</span>
                              </div>
                              <span className="text-sm font-black text-[var(--accent)]">{p.progress}%</span>
                           </div>
                           <div className="h-1.5 bg-[var(--bg-raised)] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/30 transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                           </div>
                        </div>
                      )) : (
                        <div className="py-6 text-center">
                           <div className="text-4xl mb-4 opacity-50">🌱</div>
                           <p className="text-sm text-[var(--text-muted)] font-medium">You aren't assigned to any projects yet.<br/>Take a breather!</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             {/* Right Sidebar Widgets */}
             <div className="space-y-8 animate-spring delay-300">
                <div className="card p-8 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-raised)] border border-[var(--border)] text-[var(--text-primary)] relative overflow-hidden group">
                   <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[var(--accent)]/20 rounded-full blur-3xl group-hover:bg-[var(--accent)]/30 transition-all duration-500"></div>
                   <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-8">My Progress</h3>
                   <div className="flex items-center gap-6 mb-8">
                      <div className="flex-1">
                         <p className="text-4xl font-black mb-1">
                            {statsData?.totalTasks > 0 ? Math.round(((statsData?.tasksByStatus?.Completed || 0) / statsData.totalTasks) * 100) : 0}%
                         </p>
                         <p className="text-[9px] font-bold text-[var(--accent-secondary)] uppercase tracking-widest">Completion</p>
                      </div>
                      <div className="flex-1">
                         <p className="text-4xl font-black mb-1">{statsData?.totalTasks || 0}</p>
                         <p className="text-[9px] font-bold text-[var(--accent-secondary)] uppercase tracking-widest">Total Tasks</p>
                      </div>
                   </div>
                   <Link to="/attendance" className="btn-primary w-full text-center mt-2">I'm here today!</Link>
                </div>

                <div className="card p-8 shadow-sm group">
                   <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-6">Time Off</h3>
                   <div className="flex items-end justify-between mb-8">
                      <div>
                         <p className="text-4xl font-black text-[var(--text-primary)]">
                           {20 - myLeaves.filter(l => l.status === 'Approved').reduce((acc, curr) => {
                             const diffTime = Math.abs(new Date(curr.endDate) - new Date(curr.startDate));
                             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                             return acc + diffDays;
                           }, 0)}
                         </p>
                         <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Days Remaining</p>
                      </div>
                      <div className="w-12 h-12 bg-[var(--green-dim)] rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🌴</div>
                   </div>
                   <Link to="/leaves" className="block w-full py-4 border border-[var(--border)] rounded-2xl text-[12px] font-bold text-[var(--text-primary)] text-center hover:bg-[var(--bg-raised)] hover:border-[var(--accent-dim)] transition-all">Request time off</Link>
                </div>
             </div>

          </div>
        )}
      </main>
    </div>
  );
}
