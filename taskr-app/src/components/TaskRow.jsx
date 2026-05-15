export default function TaskRow({ task, onToggle }) {
  const { id, title, subtasks, priority, dueDate, status } = task;
  const isCompleted = status === 'Completed';
  const isOverdue = !isCompleted && new Date(dueDate) < new Date();

  const priorityColors = {
    High: 'text-[var(--red)] bg-[var(--red-dim)]',
    Medium: 'text-[var(--amber)] bg-[var(--amber-dim)]',
    Low: 'text-[var(--green)] bg-[var(--green-dim)]'
  };

  return (
    <div className="flex items-center justify-between p-3.5 hover:bg-[var(--bg-raised)]/50 rounded-[12px] transition-colors group">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onToggle(id, isCompleted ? 'InProgress' : 'Completed')}
          className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all ${
            isCompleted 
              ? 'bg-[var(--accent)] border-[var(--accent)] text-white' 
              : 'border-[var(--border-hover)] bg-transparent hover:border-[var(--accent)]'
          }`}
        >
          {isCompleted && (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div className="flex flex-col">
          <span className={`text-[13px] font-semibold transition-all ${
            isCompleted ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'
          }`}>
            {title}
          </span>
          <span className="text-[11px] text-[var(--text-muted)] font-medium">
            {subtasks} subtasks · Updated 2h ago
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${priorityColors[priority] || priorityColors.Medium}`}>
          {priority}
        </span>
        <div className="flex items-center gap-1.5 w-[90px] justify-end">
          <svg className={`w-3.5 h-3.5 ${isOverdue ? 'text-[var(--red)]' : 'text-[var(--text-muted)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={`text-[11px] font-bold ${isOverdue ? 'text-[var(--red)]' : 'text-[var(--text-secondary)]'}`}>
            {new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}
