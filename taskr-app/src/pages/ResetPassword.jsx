import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await resetPassword(token, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="w-full max-w-md p-10 bg-white border border-slate-200 rounded-[32px] shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">New Password</h2>
          <p className="text-sm text-slate-500 font-medium">Please enter your new secure password</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
             <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl text-center font-medium">
               Password reset successfully! Redirecting...
             </div>
             <Link to="/login" className="text-[11px] font-bold text-blue-600 hover:text-blue-500 uppercase tracking-widest transition-colors">
               Go to Login Now
             </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
