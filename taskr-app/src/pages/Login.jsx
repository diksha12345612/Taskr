import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      // Expecting response.data to have { user, token }
      const { user, token } = response.data.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to sign in. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-base)] p-4 font-sans">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-8">
        <div 
          className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center animate-spin"
          style={{ animationDuration: '3s' }}
        >
          <div className="w-4 h-4 bg-[var(--bg-base)] rounded-sm" />
        </div>
        <h1 className="text-3xl font-[800] tracking-tight text-[var(--text-primary)]">
          Taskr
        </h1>
      </div>

      {/* Login Card */}
      <div 
        className="w-full max-w-[400px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-[32px] shadow-2xl"
        style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}
      >
        <div className="text-center mb-8">
          <h2 className="text-[22px] font-semibold text-[var(--text-primary)] mb-1">
            Welcome back
          </h2>
          <p className="text-[14px] text-[var(--text-muted)]">
            Sign in to your workspace
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[var(--red-dim)] text-[var(--red)] text-[12px] rounded-[8px] border border-[var(--red)] border-opacity-20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5 ml-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--text-primary)] text-[13px] rounded-[10px] px-[14px] py-[10px] outline-none transition-colors focus:border-[var(--accent)] placeholder-[var(--text-faint)]"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--text-primary)] text-[13px] rounded-[10px] pl-[14px] pr-10 py-[10px] outline-none transition-colors focus:border-[var(--accent)] placeholder-[var(--text-faint)]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye Slash Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Eye Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[40px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-[700] text-[14px] rounded-[10px] transition-transform disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-[1px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        {/* Bottom Link */}
        <div className="mt-6 text-center">
          <p className="text-[13px] text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
