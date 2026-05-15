import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, getProjects } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Timeline() {
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
        // Extract data correctly from backend response { data: [...] }
        setTasks(tasksRes.data.data || []);
        setProjects(projectsRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch timeline data', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Group tasks by Month/Day
  const groupedTasks = sortedTasks.reduce((groups, task) => {
    const date = new Date(task.dueDate).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pl-[236px]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-8">
        <header className="mb-10" style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
          <h1 className="text-[26px] font-[800] font-outfit tracking-tight">Project Timeline</h1>
          <p className="text-[12px] text-[var(--text-muted)] font-medium">Visualizing your team's roadmap and milestones</p>
        </header>

        <div className="max-w-4xl">
          {loading ? (
            <div className="flex flex-col gap-8">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 w-32 bg-[var(--bg-surface)] rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-20 bg-[var(--bg-surface)] rounded-xl" />
                    <div className="h-20 bg-[var(--bg-surface)] rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(groupedTasks).length > 0 ? (
            <div className="space-y-12">
              {Object.entries(groupedTasks).map(([month, monthTasks], mIndex) => (
                <div key={month} style={{ animation: `fadeSlideIn 0.4s ease ${mIndex * 0.1}s both` }}>
                  <h2 className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-6 flex items-center gap-3">
                    {month}
                    <div className="flex-1 h-[1px] bg-[var(--border)]" />
                  </h2>

                  <div className="relative border-l-2 border-[var(--border)] ml-3 pl-8 space-y-6">
                    {monthTasks.map((task, tIndex) => {
                      const project = projects.find(p => p.id === task.projectId);
                      const isCompleted = task.status === 'Completed';
                      const isOverdue = !isCompleted && new Date(task.dueDate) < new Date();

                      return (
                        <div key={task.id} className="relative group">
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[41px] top-1.5 w-[18px] h-[18px] rounded-full border-4 border-[var(--bg-base)] z-10 transition-all ${
                            isCompleted ? 'bg-[var(--green)]' : isOverdue ? 'bg-[var(--red)]' : 'bg-[var(--accent)]'
                          }`} />

                          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[18px] hover:border-[var(--accent)] transition-all shadow-sm hover:shadow-md">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-tighter block mb-1">
                                  {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                                </span>
                                <h3 className={`text-[15px] font-bold ${isCompleted ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
                                  {task.title}
                                </h3>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                task.priority === 'High' ? 'text-[var(--red)] bg-[var(--red-dim)]' : 
                                task.priority === 'Medium' ? 'text-[var(--amber)] bg-[var(--amber-dim)]' : 
                                'text-[var(--green)] bg-[var(--green-dim)]'
                              }`}>
                                {task.priority}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span className="text-[11px] font-bold text-[var(--text-secondary)]">{project?.name || 'General'}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-[11px] font-medium text-[var(--text-muted)]">Assignee #{task.assigneeId?.slice(-4) || '---'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-[var(--bg-surface)] rounded-3xl flex items-center justify-center mb-6 border border-[var(--border)]">
                <svg className="w-10 h-10 text-[var(--text-faint)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-[18px] font-bold mb-2">No timeline data found</h3>
              <p className="text-[14px] text-[var(--text-muted)] max-w-xs">Tasks with due dates will appear here chronologically.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
