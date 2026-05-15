import { useEffect, useState } from 'react';

export default function StatCard({ label, value, icon, theme = 'indigo' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const themes = {
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    green: { text: 'text-[var(--green)]', bg: 'bg-[var(--green-dim)]', border: 'border-[var(--green)]/20' },
    red: { text: 'text-[var(--red)]', bg: 'bg-[var(--red-dim)]', border: 'border-[var(--red)]/20' },
    blue: { text: 'text-[var(--blue)]', bg: 'bg-[var(--blue-dim)]', border: 'border-[var(--blue)]/20' },
  };

  const currentTheme = themes[theme] || themes.indigo;

  return (
    <div 
      className={`p-4 bg-[var(--bg-surface)] border ${currentTheme.border} rounded-[16px] flex flex-col gap-3 shadow-lg`}
      style={{ animation: 'countUp 0.6s ease-out forwards' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg ${currentTheme.bg} ${currentTheme.text}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-outfit font-bold text-[var(--text-primary)]">
          {displayValue}
        </span>
        {/* Optional: Add percentage or secondary info here if needed */}
      </div>
    </div>
  );
}
