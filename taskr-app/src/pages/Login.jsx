import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, googleLogin } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const response = await googleLogin({ credential: credentialResponse.credential });
      const { user, token } = response.data.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google Auth failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const { user, token } = response.data.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-blue-500/10">
      
      {/* Left Column: Branding & Marketing */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-20 relative overflow-hidden bg-white">
        {/* Background Decorative Glow (Soft Light) */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-50/30 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-green-500/20">T</div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Taskr</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 mb-8">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">New: Team Workspaces 2.0</span>
          </div>

          <h1 className="text-6xl font-extrabold tracking-tighter leading-[1.1] mb-8 text-slate-900">
            Your Gateway to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Team Efficiency</span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed max-w-xl">
            A comprehensive, production-grade platform bridging teams, 
            projects, and goals with streamlined collaborative workflows.
          </p>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter text-slate-900">10k+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Tasks Managed</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter text-slate-900">98%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Card */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative bg-[var(--bg-base)]">
        <div className="w-full max-w-[480px]">
          {/* Card with Tabs */}
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="flex border-b border-slate-100">
              <Link to="/login" className="flex-1 py-5 text-center text-sm font-bold bg-slate-50 text-slate-900 border-b-2 border-green-600 transition-all">
                Sign In
              </Link>
              <Link to="/signup" className="flex-1 py-5 text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">
                Register
              </Link>
            </div>

            <div className="p-10 lg:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Welcome Back</h2>
                <p className="text-sm text-slate-500 font-medium">Sign in to access your team portal</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center font-medium">
                  {error}
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
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all placeholder:text-slate-300 text-slate-900"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2.5 ml-1">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                    <Link to="/forgot-password" className="text-[11px] font-bold text-green-600 hover:text-green-500 transition-colors uppercase tracking-widest">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-5 pr-12 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all placeholder:text-slate-300 text-slate-900"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-green-500/20 disabled:opacity-70 flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'Sign In'}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>

              <div className="flex justify-center">
                 <GoogleLogin
                   onSuccess={handleGoogleSuccess}
                   onError={() => setError('Google Auth Failed')}
                   useOneTap
                   theme="outline"
                   shape="pill"
                   text="signin_with"
                   width="320"
                 />
              </div>
            </div>
          </div>
          
          <p className="mt-10 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Empowering Teams Worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
