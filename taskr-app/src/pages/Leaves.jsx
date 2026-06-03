import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyLeaves, getAllLeaves, requestLeave, updateLeaveStatus } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Leaves() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'Sick',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      const res = isAdmin ? await getAllLeaves() : await getMyLeaves();
      setLeaves(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch leaves', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestLeave(formData);
      setShowModal(false);
      fetchLeaves();
      alert('Leave request submitted!');
      setFormData({ type: 'Sick', startDate: '', endDate: '', reason: '' });
    } catch (err) {
      alert('Failed to submit leave request');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      fetchLeaves();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pl-[236px]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-8">
        <header className="flex items-center justify-between mb-10" style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}>
          <div>
            <h1 className="text-[26px] font-[800] font-outfit tracking-tight">Time Off</h1>
            <p className="text-[12px] text-[var(--text-muted)] font-medium">Take a break, you've earned it.</p>
          </div>
          {!isAdmin ? (
            <button 
              type="button"
              onClick={() => setShowModal(true)}
              className="h-[42px] px-6 bg-[var(--accent)] text-white text-[13px] font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent-dim)]"
            >
              Request Leave
            </button>
          ) : (
            <div className="h-[42px] px-6 flex items-center bg-[var(--bg-raised)] text-[var(--text-secondary)] text-[13px] font-bold rounded-xl border border-[var(--border)]">
              Admin Approval Mode
            </div>
          )}
        </header>

        {/* Leaves Table */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[24px] overflow-hidden shadow-sm">
           <div className="p-6 border-b border-[var(--border)]">
              <h3 className="text-[16px] font-bold">{isAdmin ? 'Team Leave Requests' : 'My Leave History'}</h3>
           </div>
           <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--bg-raised)]/50">
                <tr>
                  {isAdmin && <th className="p-4 pl-8 text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest">Member</th>}
                  <th className={`p-4 ${!isAdmin ? 'pl-8' : ''} text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest`}>Type</th>
                  <th className="p-4 text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest">Dates</th>
                  <th className="p-4 text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest">Reason</th>
                  <th className="p-4 text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest text-right pr-8">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-[var(--border)]">
                      <td colSpan={isAdmin ? 5 : 4} className="p-6 bg-[var(--bg-surface)]/50"></td>
                    </tr>
                  ))
                ) : leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <tr key={leave.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-raised)]/30 transition-colors">
                      {isAdmin && (
                        <td className="p-4 pl-8">
                          <span className="text-[13px] font-bold">{leave.user?.name}</span>
                        </td>
                      )}
                      <td className={`p-4 ${!isAdmin ? 'pl-8' : ''}`}>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-[10px] font-bold uppercase">{leave.type}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[12px] font-medium">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[12px] text-[var(--text-secondary)] truncate max-w-[200px] block">{leave.reason || 'No reason provided'}</span>
                      </td>
                      <td className="p-4 text-right pr-8">
                        {isAdmin && leave.status === 'Pending' ? (
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => handleStatusUpdate(leave.id, 'Approved')} className="px-2 py-1 bg-[var(--green-dim)] text-[var(--green)] rounded text-[10px] font-bold hover:bg-[var(--green)] hover:text-white transition-all">APPROVE</button>
                            <button type="button" onClick={() => handleStatusUpdate(leave.id, 'Rejected')} className="px-2 py-1 bg-[var(--red-dim)] text-[var(--red)] rounded text-[10px] font-bold hover:bg-[var(--red)] hover:text-white transition-all">REJECT</button>
                          </div>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            leave.status === 'Approved' ? 'text-[var(--green)] bg-[var(--green-dim)]' : 
                            leave.status === 'Rejected' ? 'text-[var(--red)] bg-[var(--red-dim)]' : 
                            'text-[var(--amber)] bg-[var(--amber-dim)]'
                          }`}>
                            {leave.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="p-16 text-center text-[var(--text-muted)] text-[14px]">
                       <div className="text-4xl mb-4 opacity-50">🌴</div>
                       <p className="italic">No time off requested yet. Planning a vacation?</p>
                    </td>
                  </tr>
                )}
              </tbody>
           </table>
        </div>

        {/* Request Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
             <div className="bg-[var(--bg-surface)] border border-[var(--border)] w-full max-w-[420px] rounded-[32px] p-8 shadow-2xl relative animate-spring">
                <h2 className="text-[24px] font-black mb-6">Schedule Time Off</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                   <div>
                      <label className="block text-[11px] font-bold text-[var(--text-faint)] uppercase mb-2">Leave Type</label>
                      <select 
                        value={formData.type} 
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl p-3 text-[13px] outline-none focus:border-[var(--accent)]"
                      >
                        <option value="Sick">Sick Leave</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Personal">Personal Day</option>
                        <option value="Other">Other</option>
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-faint)] uppercase mb-2">Start Date</label>
                        <input required type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl p-3 text-[13px] outline-none focus:border-[var(--accent)]" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[var(--text-faint)] uppercase mb-2">End Date</label>
                        <input required type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl p-3 text-[13px] outline-none focus:border-[var(--accent)]" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-[var(--text-faint)] uppercase mb-2">Reason</label>
                      <textarea rows="3" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl p-3 text-[13px] outline-none focus:border-[var(--accent)] resize-none" placeholder="Briefly explain..." />
                   </div>
                   <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-[46px] bg-[var(--bg-raised)] font-bold rounded-xl transition-all">Cancel</button>
                      <button type="submit" className="flex-1 h-[46px] bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent-dim)]">Submit Request</button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
