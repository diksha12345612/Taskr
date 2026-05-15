export default function Badge({ text, type = 'medium' }) {
  const styles = {
    high: 'bg-[var(--red-dim)] text-[var(--red)] border border-[var(--red)] border-opacity-30',
    medium: 'bg-[var(--amber-dim)] text-[var(--amber)] border border-[var(--amber)] border-opacity-30',
    low: 'bg-[var(--green-dim)] text-[var(--green)] border border-[var(--green)] border-opacity-30',
    active: 'bg-[var(--green-dim)] text-[var(--green)] border border-[var(--green)] border-opacity-30',
    review: 'bg-[var(--blue-dim)] text-[var(--blue)] border border-[var(--blue)] border-opacity-30',
    hold: 'bg-[var(--amber-dim)] text-[var(--amber)] border border-[var(--amber)] border-opacity-30'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${styles[type] || styles.medium}`}>
      {text}
    </span>
  );
}
