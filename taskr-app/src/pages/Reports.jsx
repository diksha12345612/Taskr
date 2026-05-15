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

  // Analytics Logic
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityTasks = tasks.filter(t => t.priority === 'High').length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'Medium').length;
  const lowPriorityTasks = tasks.filter(t => t.priority === 'Low').length;

  const projectStats = projects.map(p => {
    const pTasks = tasks.filter(t => t.projectId === p.id);
    const pCompleted = pTasks.filter(t => t.status === 'Completed').length;
    const pRate = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;
    return { ...p, completionRate: pRate, taskCount: pTasks.length };
  });

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pl-[236px]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-8">
        <header className="mb-10" style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
          <h1 className="text-[26px] font-[800] font-outfit tracking-tight">Performance Reports</h1>
          <p className="text-[12px] text-[var(--text-muted)] font-medium">Detailed analytics and productivity metrics</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Main Stat Card */}
          <div className="lg:col-span-2 p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[24px] relative overflow-hidden group shadow-sm">
            <div className="relative z-10">
              <h3 className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Overall Completion Rate</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-[800] font-outfit text-[var(--accent)]">{completionRate}%</span>
                <span className="text-[14px] text-[var(--text-muted)] font-medium">of total work done</span>
              </div>
              
              <div className="w-full h-3 bg-[var(--bg-raised)] rounded-full overflow-hidden border border-[var(--border)]">
                <div 
                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[var(--accent)]/5 rounded-full blur-3xl group-hover:bg-[var(--accent)]/10 transition-all" />
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[20px]">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase block mb-1">High Priority Load</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{highPriorityTasks}</span>
                <span className="text-[11px] px-2 py-0.5 bg-[var(--red-dim)] text-[var(--red)] rounded-md font-bold">CRITICAL</span>
              </div>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[20px]">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase block mb-1">Avg Project Health</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">Good</span>
                <div className="w-2.5 h-2.5 bg-[var(--green)] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Project Breakdown Table */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[24px] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--border)]">
            <h3 className="text-[16px] font-bold">Project Velocity</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--bg-raised)]/50">
              <tr>
                <th className="p-4 text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest pl-8">Project Name</th>
                <th className="p-4 text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest">Tasks</th>
                <th className="p-4 text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest">Progress</th>
                <th className="p-4 text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest text-right pr-8">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-[var(--border)]">
                    <td colSpan={4} className="p-6 bg-[var(--bg-surface)]/50"></td>
                  </tr>
                ))
              ) : projectStats.map((p, index) => (
                <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-raised)]/30 transition-colors">
                  <td className="p-4 pl-8">
                    <span className="text-[13px] font-bold text-[var(--text-primary)]">{p.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[12px] font-medium text-[var(--text-secondary)]">{p.taskCount} items</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px] h-1.5 bg-[var(--bg-raised)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--green)]" style={{ width: `${p.completionRate}%` }} />
                      </div>
                      <span className="text-[11px] font-bold">{p.completionRate}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right pr-8">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'Active' ? 'text-[var(--blue)] bg-[var(--blue-dim)]' : 'text-[var(--amber)] bg-[var(--amber-dim)]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
