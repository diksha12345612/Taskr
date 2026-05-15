import { useEffect, useState } from 'react';
import { getMyAttendance, checkIn, checkOut } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Attendance() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayRecord, setTodayRecord] = useState(null);

  const fetchAttendance = async () => {
    try {
      const res = await getMyAttendance();
      const data = res.data.data || [];
      setHistory(data);
      
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRec = data.find(r => r.date.split('T')[0] === todayStr);
      setTodayRecord(todayRec);
    } catch (err) {
      console.error('Failed to fetch attendance', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      await checkIn();
      fetchAttendance();
      alert('Got it! You are checked in for today. Have a great shift!');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong. Let\'s try again.');
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      fetchAttendance();
      alert('All done! You are checked out. Enjoy your evening!');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong. Let\'s try again.');
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pl-[236px]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-10">
        <header className="mb-12" style={{ animation: 'springIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <div className="flex items-center gap-3 mb-2">
             <span className="text-3xl">⏰</span>
             <h1 className="text-[32px] font-[800] tracking-tight">Time & Presence</h1>
          </div>
          <p className="text-[14px] text-[var(--text-secondary)] font-medium max-w-lg">Track your daily rhythm and stay in sync with the team.</p>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 glass-card p-10 flex flex-col items-center text-center relative overflow-hidden" style={{ animation: 'springIn 0.8s ease 0.1s both' }}>
            <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-8 transition-transform hover:rotate-3 ${todayRecord?.checkIn ? 'bg-[var(--green-dim)] text-[var(--green)]' : 'bg-[var(--accent-dim)] text-[var(--accent)]'}`}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-[22px] font-bold mb-3">
              {todayRecord?.checkIn ? "You're all set for today!" : "Ready to start your day?"}
            </h3>
            <p className="text-[14px] text-[var(--text-muted)] mb-10 max-w-sm">
              {todayRecord?.checkIn 
                ? "Your presence is marked. Focus on doing your best work today!" 
                : "Checking in helps your team know you're available and ready to collaborate."}
            </p>
            
            <div className="flex gap-4 w-full max-w-md">
              <button 
                onClick={handleCheckIn}
                disabled={!!todayRecord?.checkIn}
                className="flex-1 h-[54px] bg-[var(--accent)] text-white font-[800] rounded-2xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 shadow-lg shadow-[var(--accent-dim)] transform active:scale-95"
              >
                {todayRecord?.checkIn ? 'Checked In' : 'Check In Now'}
              </button>
              <button 
                onClick={handleCheckOut}
                disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
                className="flex-1 h-[54px] bg-[var(--bg-raised)] text-[var(--text-primary)] font-[800] rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] transition-all disabled:opacity-50 transform active:scale-95"
              >
                Check Out
              </button>
            </div>

            {todayRecord && (
              <div className="mt-8 p-4 bg-[var(--bg-raised)] rounded-2xl border border-[var(--glass-border)] animate-fade-in">
                <p className="text-[13px] font-bold">
                  Today: <span className="text-[var(--accent)]">{todayRecord.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}</span>
                  {todayRecord.checkOut && <> — <span className="text-[var(--warm-accent)]">{new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></>}
                </p>
              </div>
            )}
          </div>

          <div className="glass-card p-8 space-y-6" style={{ animation: 'springIn 0.8s ease 0.2s both' }}>
             <h3 className="text-[16px] font-black uppercase tracking-widest text-[var(--text-faint)]">Summary</h3>
             <div className="space-y-4">
                <div className="p-5 bg-[var(--bg-raised)] rounded-[20px] border border-[var(--glass-border)]">
                  <p className="text-[11px] font-black text-[var(--text-muted)] uppercase mb-1">Days Present</p>
                  <p className="text-[24px] font-[800] text-[var(--green)]">{history.length}</p>
                </div>
                <div className="p-5 bg-[var(--bg-raised)] rounded-[20px] border border-[var(--glass-border)]">
                  <p className="text-[11px] font-black text-[var(--text-muted)] uppercase mb-1">Standard In</p>
                  <p className="text-[24px] font-[800] text-[var(--accent)]">10:30 AM</p>
                </div>
                <div className="p-5 bg-[var(--bg-raised)] rounded-[20px] border border-[var(--glass-border)]">
                  <p className="text-[11px] font-black text-[var(--text-muted)] uppercase mb-1">Standard Out</p>
                  <p className="text-[24px] font-[800] text-[var(--warm-accent)]">07:00 PM</p>
                </div>
             </div>
          </div>
        </div>

        {/* History Table */}
        <div className="glass-card overflow-hidden shadow-sm" style={{ animation: 'springIn 0.8s ease 0.3s both' }}>
           <div className="p-8 border-b border-[var(--glass-border)]">
              <h3 className="text-[18px] font-bold">Attendance History</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--bg-raised)]/50">
                  <tr>
                    <th className="p-5 pl-8 text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em]">Date</th>
                    <th className="p-5 text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em]">Check In</th>
                    <th className="p-5 text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em]">Check Out</th>
                    <th className="p-5 text-[11px] font-black text-[var(--text-faint)] uppercase tracking-[0.2em] text-right pr-8">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse border-b border-[var(--glass-border)]">
                        <td colSpan={4} className="p-8 bg-[var(--bg-surface)]/30"></td>
                      </tr>
                    ))
                  ) : history.length > 0 ? (
                    history.map((record) => (
                      <tr key={record.id} className="border-b border-[var(--glass-border)] hover:bg-[var(--bg-raised)]/30 transition-colors">
                        <td className="p-5 pl-8">
                          <span className="text-[14px] font-[800]">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                        </td>
                        <td className="p-5">
                          <span className="text-[13px] font-bold text-[var(--text-secondary)]">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className="text-[13px] font-bold text-[var(--text-secondary)]">
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                          </span>
                        </td>
                        <td className="p-5 text-right pr-8">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            record.status === 'Present' ? 'text-[var(--green)] bg-[var(--green-dim)]' : 'text-[var(--red)] bg-[var(--red-dim)]'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-[var(--text-muted)] text-[15px] font-medium italic">No attendance history yet. Your journey starts here!</td>
                    </tr>
                  )}
                </tbody>
             </table>
           </div>
        </div>
      </main>
    </div>
  );
}
