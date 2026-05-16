import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser, googleLogin } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member' // Hardcoded to Member for security
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setApiError(null);
    try {
      // Google signups are also forced to Member role on the backend
      const response = await googleLogin({ credential: credentialResponse.credential });
      const { user, token } = response.data.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Google Auth failed.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError(null);
    setLoading(true);

    try {
      const response = await registerUser(formData);
      const { user, token } = response.data.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-blue-500/10">
      
      {/* Left Column: Branding & Marketing */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-20 relative overflow-hidden bg-white">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-50/30 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/20">T</div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Taskr</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">New: Team Workspaces 2.0</span>
          </div>

          <h1 className="text-6xl font-extrabold tracking-tighter leading-[1.1] mb-8 text-slate-900">
            The Gateway to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Collaborative Success</span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed max-w-xl">
            Join thousands of teams streamlining their production 
            workflows with our unified task management ecosystem.
          </p>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter text-slate-900">10k+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter text-slate-900">99.9%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Card */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative bg-[var(--bg-base)]">
        <div className="w-full max-w-[480px]">
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="flex border-b border-slate-100">
              <Link to="/login" className="flex-1 py-5 text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">
                Sign In
              </Link>
              <Link to="/signup" className="flex-1 py-5 text-center text-sm font-bold bg-slate-50 text-slate-900 border-b-2 border-blue-600 transition-all">
                Register
              </Link>
            </div>

            <div className="p-10 lg:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Create Account</h2>
                <p className="text-sm text-slate-500 font-medium">Get started as a team member today</p>
              </div>

              {apiError && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center font-medium">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900"
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-500 text-[10px] mt-1.5 ml-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Account Type</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="Member">Member (Project Access)</option>
                    <option value="Admin">Admin (Full Management)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70 mt-4"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
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
                   onError={() => setApiError('Google Auth Failed')}
                   useOneTap
                   theme="outline"
                   shape="pill"
                   text="signup_with"
                   width="320"
                 />
              </div>
            </div>
          </div>
          
          <p className="mt-10 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Secured by Taskr Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
