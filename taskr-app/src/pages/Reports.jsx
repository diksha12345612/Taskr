import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, getProjects } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Reports() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          getTasks(),
          getProjects()
        ]);
        setTasks(tasksRes.data.data || []);
        setProjects(projectsRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch reports data', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityTasks = tasks.filter(t => t.priority === 'High').length;

  const projectStats = projects.map(p => {
    const pTasks = tasks.filter(t => t.projectId === p.id);
    const pCompleted = pTasks.filter(t => t.status === 'Completed').length;
    const pRate = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;
    return { ...p, completionRate: pRate, taskCount: pTasks.length };
  });

  return (
    <div className="flex h-screen mesh-gradient text-[var(--text-primary)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-10 lg:p-14 ml-[236px] animate-fade">
        <header className="mb-14">
          <p className="text-xs font-bold text-[var(--accent-secondary)] uppercase tracking-[0.3em] mb-3">Intelligence Hub</p>
          <h1 className="text-5xl font-black tracking-tighter mb-2">Performance Analytics</h1>
          <p className="text-base text-[var(--text-secondary)] font-medium">Deep dive into team velocity and project health.</p>
        </header>

        {/* Bento Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
          
          {/* Velocity Card */}
          <div className="md:col-span-4 lg:col-span-3 card p-10 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)]">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Global Velocity</h3>
                <span className="text-xs font-bold text-[var(--accent)] px-3 py-1 bg-[var(--accent-dim)] rounded-full">REAL-TIME</span>
             </div>
             
             <div className="flex items-end gap-4 mb-10">
                <span className="text-7xl font-black tracking-tighter text-[var(--accent)]">{completionRate}%</span>
                <span className="text-sm font-bold text-[var(--text-muted)] pb-3">Project Completion</span>
             </div>

             <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
             </div>
             <p className="text-xs text-[var(--text-secondary)] font-medium italic">"The team is performing {completionRate > 60 ? 'above' : 'near'} the expected baseline."</p>
          </div>

          {/* Quick Metrics */}
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="card p-8 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">High Pressure Load</p>
                <p className="text-4xl font-black text-[var(--red)]">{highPriorityTasks}</p>
                <p className="text-[10px] text-[var(--text-faint)] mt-2 font-bold uppercase">Tasks at Risk</p>
             </div>
             <div className="card p-8 flex flex-col justify-center bg-[var(--accent-dim)]/5 border-[var(--accent)]/10">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Project Stability</p>
                <p className="text-4xl font-black text-[var(--green)]">Strong</p>
                <p className="text-[10px] text-[var(--text-faint)] mt-2 font-bold uppercase">System Confidence</p>
             </div>
             <div className="md:col-span-2 card p-8 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Average Turnaround</p>
                   <p className="text-2xl font-bold">2.4 Days</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl">⚡</div>
             </div>
          </div>
        </div>

        {/* Project Breakdown */}
        <section className="card p-0 overflow-hidden">
          <div className="p-8 border-b border-[var(--border)] bg-white/[0.02]">
            <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Project Performance Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-surface)]">
                  <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-[0.2em]">Initiative</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-[0.2em]">Density</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-[0.2em]">Efficiency</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-[0.2em] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse"><td colSpan="4" className="h-16 bg-white/[0.01]"></td></tr>
                )) : projectStats.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold group-hover:text-[var(--accent)] transition-colors">{p.name}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-[var(--text-secondary)]">{p.taskCount} Units</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-[var(--accent-secondary)]" style={{ width: `${p.completionRate}%` }}></div>
                          </div>
                          <span className="text-[10px] font-black">{p.completionRate}%</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         p.status === 'Active' ? 'text-[var(--green)] bg-[var(--green)]/10' : 'text-[var(--amber)] bg-[var(--amber)]/10'
                       }`}>
                         {p.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
