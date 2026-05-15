import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, getTasks } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    (async () => {
      try {
        const [projRes, taskRes] = await Promise.all([getProjects(), getTasks()]);
        setProjects(projRes.data.data || []);
        setTasks(taskRes.data.data || []);
      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    { label: 'Active Projects', value: projects.length, icon: '🚀', bg: 'bg-[var(--accent-dim)]', trend: '+2 this week' },
    { label: 'Total Tasks', value: tasks.length, icon: '📝', bg: 'bg-[var(--warm-dim)]', trend: 'Keep it up!' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, icon: '✅', bg: 'bg-[var(--green-dim)]', trend: 'Doing great!' },
    { label: 'High Priority', value: tasks.filter(t => t.priority === 'High').length, icon: '🔥', bg: 'bg-[var(--red-dim)]', trend: 'Focus here' },
  ];

  // Calculate Performance
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const totalTasks = tasks.length;
  const performancePct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  let rating = { label: 'Good Start', icon: '🌱', color: 'text-[var(--text-secondary)]', desc: 'Complete more tasks to see your rating!' };
  if (totalTasks > 0) {
    if (performancePct >= 80) rating = { label: 'Best Work', icon: '🌟', color: 'text-[var(--green)]', desc: 'You are absolutely crushing it this week!' };
    else if (performancePct >= 50) rating = { label: 'Average Work', icon: '⚡', color: 'text-[var(--amber)]', desc: 'You are on track, keep the momentum going!' };
    else rating = { label: 'Needs Focus', icon: '🐢', color: 'text-[var(--red)]', desc: 'Try to clear some small tasks to boost your score.' };
  }

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pl-[236px]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar p-10">
        <header className="mb-12 flex items-center justify-between" style={{ animation: 'springIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <div>
            <div className="flex items-center gap-4 mb-2">
               <span className="text-4xl">👋</span>
               <h1 className="text-[34px] font-[800] tracking-tight">{greeting}, {user?.name.split(' ')[0]}!</h1>
            </div>
            <p className="text-[15px] text-[var(--text-secondary)] font-medium max-w-lg leading-relaxed">
              It's a beautiful day to collaborate. Here's what's happening in your workspace right now.
            </p>
          </div>

          <div className="glass-card p-5 flex items-center gap-4 border-l-4" style={{ borderColor: `var(--${rating.color.split('[')[1].split(']')[0]})` }}>
             <div className="text-3xl">{rating.icon}</div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-faint)]">Your Performance</p>
                <h4 className={`text-[18px] font-[900] ${rating.color}`}>{rating.label}</h4>
                <p className="text-[11px] text-[var(--text-muted)] font-medium">{rating.desc}</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="glass-card p-6 hover:translate-y-[-6px] transition-all duration-300 group cursor-default"
              style={{ animation: `springIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s both` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg}`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-[800] tracking-tight">{stat.value}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                 <p className="text-[10px] font-bold text-[var(--text-faint)] uppercase">{stat.trend}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Performance Graph Section */}
          <section className="lg:col-span-2 glass-card p-8" style={{ animation: 'springIn 0.8s ease 0.3s both' }}>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-[22px] font-[800] tracking-tight">Weekly Performance</h2>
                <p className="text-[13px] text-[var(--text-muted)] font-medium">Your daily productivity rhythm</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
                    <span className="text-[11px] font-black uppercase text-[var(--text-faint)]">Tasks Done</span>
                 </div>
              </div>
            </div>

            <div className="flex items-end justify-between h-[200px] px-4 gap-4">
              {[
                { day: 'Mon', val: 40, status: 'avg' },
                { day: 'Tue', val: 65, status: 'avg' },
                { day: 'Wed', val: 90, status: 'best' },
                { day: 'Thu', val: 55, status: 'avg' },
                { day: 'Fri', val: 30, status: 'poor' },
                { day: 'Sat', val: 15, status: 'poor' },
                { day: 'Sun', val: 0, status: 'poor' }
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                   <div className="w-full relative flex items-end justify-center h-full">
                      {/* Bar Background */}
                      <div className="w-full max-w-[40px] bg-[var(--bg-raised)] rounded-2xl h-full absolute bottom-0"></div>
                      {/* Active Bar */}
                      <div 
                        className={`w-full max-w-[40px] rounded-2xl transition-all duration-1000 ease-out shadow-lg ${
                          item.status === 'best' ? 'bg-gradient-to-t from-[var(--green)] to-[#6ee7b7] shadow-[var(--green-dim)]' :
                          item.status === 'avg' ? 'bg-gradient-to-t from-[var(--accent)] to-[var(--accent-hover)] shadow-[var(--accent-dim)]' :
                          'bg-gradient-to-t from-[var(--text-faint)] to-[var(--text-muted)]'
                        }`}
                        style={{ height: `${item.val}%`, animation: `progFill 1.2s ease-out ${i * 0.1}s both`, '--target-width': `${item.val}%` }}
                      >
                         <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-surface)] border border-[var(--border)] px-2 py-1 rounded-lg text-[10px] font-bold transition-all">
                           {item.val}%
                         </div>
                      </div>
                   </div>
                   <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{item.day}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Performance Insight */}
          <section className="glass-card p-8 bg-gradient-to-br from-[var(--accent-dim)] to-transparent border-none" style={{ animation: 'springIn 0.8s ease 0.4s both' }}>
             <h3 className="text-[16px] font-black uppercase tracking-widest text-[var(--text-faint)] mb-6">Growth Insight</h3>
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">📈</div>
                   <div>
                      <p className="text-[14px] font-bold">Consistency is Key</p>
                      <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">Your Wednesday peak shows high focus. Try to mimic that environment!</p>
                   </div>
                </div>
                <div className="p-4 bg-[var(--bg-raised)] rounded-2xl border border-[var(--glass-border)]">
                   <p className="text-[11px] font-black text-[var(--accent)] uppercase mb-2">Weekly Goal</p>
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold">24 / 30 Tasks</span>
                      <span className="text-[11px] font-bold">80%</span>
                   </div>
                   <div className="w-full h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)] rounded-full w-[80%]"></div>
                   </div>
                </div>
             </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="glass-card p-8" style={{ animation: 'springIn 0.8s ease 0.5s both' }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[22px] font-bold tracking-tight">Active Projects</h2>
                <p className="text-[13px] text-[var(--text-muted)] font-medium">Things your team is currently crushing</p>
              </div>
              <Link to="/projects" className="px-4 py-1.5 bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl text-[12px] font-bold text-[var(--accent)] hover:border-[var(--accent)] transition-all">View all</Link>
            </div>
            
            <div className="space-y-6">
              {loading ? [1,2,3].map(i => <div key={i} className="h-12 bg-[var(--bg-raised)] animate-pulse rounded-xl" />) : 
               projects.slice(0, 3).map((project) => (
                <div key={project.id} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[15px] font-bold group-hover:text-[var(--accent)] transition-colors">{project.name}</h3>
                    <span className="text-[11px] font-bold text-[var(--text-muted)]">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[var(--bg-raised)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              {!loading && projects.length === 0 && <p className="text-center py-10 text-[var(--text-muted)]">No active projects yet.</p>}
            </div>
          </section>

          <section className="glass-card p-8" style={{ animation: 'springIn 0.8s ease 0.5s both' }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[22px] font-bold tracking-tight">Upcoming Deadlines</h2>
                <p className="text-[13px] text-[var(--text-muted)] font-medium">Don't let these sneak up on you!</p>
              </div>
              <Link to="/tasks" className="px-4 py-1.5 bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl text-[12px] font-bold text-[var(--accent)] hover:border-[var(--accent)] transition-all">Full list</Link>
            </div>
            
            <div className="space-y-4">
              {loading ? [1,2,3,4].map(i => <div key={i} className="h-16 bg-[var(--bg-raised)] animate-pulse rounded-2xl" />) :
               tasks.filter(t => t.status !== 'Completed').slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-[var(--bg-raised)] rounded-2xl transition-all border border-transparent hover:border-[var(--border)] group">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'High' ? 'bg-[var(--red)] shadow-[0_0_10px_var(--red)]' : 
                    task.priority === 'Medium' ? 'bg-[var(--amber)]' : 'bg-[var(--green)]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold truncate group-hover:text-[var(--accent)] transition-colors">{task.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">
                      {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="px-2.5 py-1.5 bg-[var(--bg-raised)] rounded-xl border border-[var(--border)]">
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-[var(--text-muted)]">TASK-{task.id.slice(-3).toUpperCase()}</span>
                  </div>
                </div>
              ))}
              {!loading && tasks.length === 0 && <p className="text-center py-10 text-[var(--text-muted)]">Everything is clear!</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
