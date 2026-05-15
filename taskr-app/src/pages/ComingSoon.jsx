import Sidebar from '../components/Sidebar';

export default function ComingSoon({ title }) {
  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="p-12 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[24px] text-center max-w-md shadow-2xl animate-fade-in">
          <div className="w-20 h-20 bg-[var(--accent-dim)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--accent)]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-[24px] font-[800] mb-2 font-outfit tracking-tight">{title} Page</h2>
          <p className="text-[14px] text-[var(--text-muted)] mb-8 font-medium">We're currently building this feature. Check back soon for updates!</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-xl font-bold text-[13px] hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent-dim)]"
          >
            Go Back
          </button>
        </div>
      </main>
    </div>
  );
}
