export default function ProjectCard({ 
  name, 
  tag, 
  status = "active", 
  progress = 0, 
  members = [], 
  tasksDone = 0, 
  tasksTotal = 0, 
  emoji = "🚀" 
}) {
  
  const statusConfig = {
    active: { 
      bg: "bg-[var(--accent-dim)]", 
      text: "text-[var(--accent)]", 
      label: "Active", 
      progressColor: "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]" 
    },
    review: { 
      bg: "bg-[var(--amber-dim)]", 
      text: "text-[var(--amber)]", 
      label: "Review", 
      progressColor: "bg-[var(--amber)]" 
    },
    hold: { 
      bg: "bg-[var(--red-dim)]", 
      text: "text-[var(--red)]", 
      label: "Hold", 
      progressColor: "bg-[var(--red)]" 
    }
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.active;
  const percentage = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : progress;

  return (
    <div className="glass-card p-6 hover:translate-y-[-6px] transition-all duration-300 group cursor-default shadow-sm hover:shadow-xl hover:shadow-[var(--accent-dim)]">
      
      {/* Top Row: Emoji & Status Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-10 h-10 bg-[var(--bg-raised)] rounded-2xl flex items-center justify-center text-[20px] shadow-inner transition-transform group-hover:scale-110">
          {emoji}
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      </div>

      {/* Name & Tag */}
      <div className="mb-6">
        <h3 className="text-[16px] font-[800] text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors tracking-tight">{name}</h3>
        <p className="text-[11px] text-[var(--text-muted)] font-black uppercase tracking-widest">{tag || 'General'}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-[11px] font-black mb-2 uppercase tracking-widest">
          <span className="text-[var(--text-faint)]">Completion</span>
          <span className="text-[var(--text-secondary)]">{percentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-[var(--bg-raised)] rounded-full overflow-hidden border border-[var(--glass-border)] p-0.5">
          <div 
            className={`h-full ${config.progressColor} rounded-full transition-all duration-1000 ease-out shadow-sm`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Footer: Avatars & Task Count */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--glass-border)]">
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((member, i) => (
            <div 
              key={i}
              className="h-8 w-8 rounded-xl border-2 border-[var(--bg-surface)] bg-[var(--accent)] flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-transform hover:translate-y-[-2px]"
              title={member.name}
            >
              {member.name?.[0] || 'U'}
            </div>
          ))}
          {members.length > 3 && (
            <div className="h-8 w-8 rounded-xl border-2 border-[var(--bg-surface)] bg-[var(--bg-raised)] flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)]">
              +{members.length - 3}
            </div>
          )}
        </div>
        <span className="text-[11px] font-black text-[var(--text-faint)] uppercase tracking-tighter">
          {tasksDone}<span className="text-[var(--accent)]">/</span>{tasksTotal} Tasks
        </span>
      </div>
    </div>
  );
}
