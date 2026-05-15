import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.role) newErrors.role = 'Role must be selected';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
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

      {/* Signup Card */}
      <div 
        className="w-full max-w-[400px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-[16px] p-[32px] shadow-2xl"
        style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}
      >
        <div className="text-center mb-8">
          <h2 className="text-[22px] font-semibold text-[var(--text-primary)] mb-1">
            Create your account
          </h2>
          <p className="text-[14px] text-[var(--text-muted)]">
            Join the workspace today
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-3 bg-[var(--red-dim)] text-[var(--red)] text-[12px] rounded-[8px] border border-[var(--red)] border-opacity-20 text-center">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Input */}
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-[var(--bg-raised)] border ${errors.name ? 'border-[var(--red)]' : 'border-[var(--border)]'} text-[var(--text-primary)] text-[13px] rounded-[10px] px-[14px] py-[10px] outline-none transition-colors focus:border-[var(--accent)] placeholder-[var(--text-faint)]`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-[var(--red)] text-[11px] mt-1 ml-1">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5 ml-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-[var(--bg-raised)] border ${errors.email ? 'border-[var(--red)]' : 'border-[var(--border)]'} text-[var(--text-primary)] text-[13px] rounded-[10px] px-[14px] py-[10px] outline-none transition-colors focus:border-[var(--accent)] placeholder-[var(--text-faint)]`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-[var(--red)] text-[11px] mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-[var(--bg-raised)] border ${errors.password ? 'border-[var(--red)]' : 'border-[var(--border)]'} text-[var(--text-primary)] text-[13px] rounded-[10px] px-[14px] py-[10px] outline-none transition-colors focus:border-[var(--accent)] placeholder-[var(--text-faint)]`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-[var(--red)] text-[11px] mt-1 ml-1">{errors.password}</p>}
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5 ml-1">
              Role
            </label>
            <select
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className={`w-full bg-[var(--bg-raised)] border ${errors.role ? 'border-[var(--red)]' : 'border-[var(--border)]'} text-[var(--text-primary)] text-[13px] rounded-[10px] px-[14px] py-[10px] outline-none transition-colors focus:border-[var(--accent)]`}
            >
              <option value="" className="bg-[var(--bg-surface)]">Select a role</option>
              <option value="Admin" className="bg-[var(--bg-surface)]">Admin</option>
              <option value="Member" className="bg-[var(--bg-surface)]">Member</option>
            </select>
            {errors.role && <p className="text-[var(--red)] text-[11px] mt-1 ml-1">{errors.role}</p>}
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
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>

        {/* Bottom Link */}
        <div className="mt-6 text-center">
          <p className="text-[13px] text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
