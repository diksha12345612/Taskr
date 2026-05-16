import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await forgotPassword({ email });
      setMessage(response.data.message || 'If that email exists, a reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="w-full max-w-md p-10 bg-white border border-slate-200 rounded-[32px] shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Reset Password</h2>
          <p className="text-sm text-slate-500 font-medium">Enter your email to receive a reset link</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
