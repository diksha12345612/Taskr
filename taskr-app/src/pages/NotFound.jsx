import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]" style={{ animation: 'fadeSlideIn 0.35s ease forwards' }}>
      <div className="text-center">
        <h1 className="text-[64px] font-[800] mb-2">404</h1>
        <p className="text-[18px] font-medium text-[var(--text-secondary)] mb-8">Page not found</p>
        <Link 
          to="/dashboard"
          className="inline-flex items-center px-6 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-lg transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
