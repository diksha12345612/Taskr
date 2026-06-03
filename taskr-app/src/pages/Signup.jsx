import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';

// Strict email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateEmail = (email) => {
  if (!email) return '';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address (e.g. name@gmail.com)';
  return '';
};

// Password rules
const PASSWORD_RULES = [
  { key: 'minLength', label: 'At least 6 characters', test: (p) => p.length >= 6 },
  { key: 'uppercase', label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { key: 'number',    label: 'One number (0-9)',           test: (p) => /[0-9]/.test(p) },
  { key: 'special',   label: 'One special character (!@#$)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
  if (passed <= 1) return { score: 1, label: 'Very Weak', color: '#ef4444' };
  if (passed === 2) return { score: 2, label: 'Weak', color: '#f97316' };
  if (passed === 3) return { score: 3, label: 'Fair', color: '#eab308' };
  if (passed === 4) return { score: 4, label: 'Strong', color: '#22c55e' };
  return { score: 5, label: 'Very Strong', color: '#10b981' };
};

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
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const isEmailValid = formData.email && EMAIL_REGEX.test(formData.email);
  const passwordStrength = getPasswordStrength(formData.password);
  const allPasswordRulesPassed = PASSWORD_RULES.every(r => r.test(formData.password));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    // Live email validation
    if (name === 'email' && emailTouched) {
      setEmailError(validateEmail(value));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(formData.email));
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordFocused(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Name validation
    if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    // Email validation
    const emailErr = validateEmail(formData.email);
    if (emailErr) {
      setEmailTouched(true);
      setEmailError(emailErr);
      newErrors.email = emailErr;
    }

    // Password validation
    if (!allPasswordRulesPassed) {
      setPasswordTouched(true);
      newErrors.password = 'Password does not meet all requirements';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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

  // Determine email input border style
  const emailBorderClass = !emailTouched
    ? ''
    : emailError
      ? 'ring-2 ring-[var(--red)]/50 border-[var(--red)]'
      : isEmailValid
        ? 'ring-2 ring-emerald-500/50 border-emerald-500'
        : '';

  // Determine password input border style
  const passwordBorderClass = !passwordTouched && !passwordFocused
    ? ''
    : passwordTouched && !allPasswordRulesPassed
      ? 'ring-2 ring-[var(--red)]/50 border-[var(--red)]'
      : allPasswordRulesPassed
        ? 'ring-2 ring-emerald-500/50 border-emerald-500'
        : '';

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent-dim)]">
      
      {/* Left Column: Branding & Marketing */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-20 relative overflow-hidden bg-[var(--bg-surface)] border-r border-[var(--border)]">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--accent-dim)]/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-50/5 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-[var(--accent)]/20">T</div>
            <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Taskr</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-dim)] border border-[var(--accent)]/10 mb-8">
             <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">New: Team Workspaces 2.0</span>
          </div>

          <h1 className="text-6xl font-extrabold tracking-tighter leading-[1.1] mb-8 text-[var(--text-primary)]">
            The Gateway to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]">Collaborative Success</span>
          </h1>
          
          <p className="text-lg text-[var(--text-secondary)] font-medium mb-12 leading-relaxed max-w-xl">
            Join thousands of teams streamlining their production 
            workflows with our unified task management ecosystem.
          </p>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter text-[var(--text-primary)]">10k+</p>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter text-[var(--text-primary)]">99.9%</p>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Card */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative bg-[var(--bg-base)]">
        <div className="w-full max-w-[480px]">
          <div className="bg-[var(--glass-bg)] border border-[var(--border)] backdrop-blur-xl rounded-[32px] overflow-hidden shadow-xl shadow-black/20">
            <div className="flex border-b border-[var(--border)]">
              <Link to="/login" className="flex-1 py-5 text-center text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                Sign In
              </Link>
              <Link to="/signup" className="flex-1 py-5 text-center text-sm font-bold bg-[var(--bg-raised)] text-[var(--text-primary)] border-b-2 border-[var(--accent)] transition-all">
                Register
              </Link>
            </div>

            <div className="p-10 lg:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-[var(--text-primary)]">Create Account</h2>
                <p className="text-sm text-[var(--text-secondary)] font-medium">Get started as a team member today</p>
              </div>

              {apiError && (
                <div className="mb-8 p-4 bg-[var(--red-dim)] border border-[var(--red)]/20 text-[var(--red)] text-xs rounded-xl text-center font-medium">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2.5 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-[var(--red)] text-[10px] mt-1.5 ml-1 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2.5 ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      className={`input-field pr-10 transition-all duration-200 ${emailBorderClass}`}
                      placeholder="you@example.com"
                    />
                    {/* Validation icon */}
                    {emailTouched && formData.email && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isEmailValid ? (
                          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-[var(--red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                  {emailTouched && emailError && (
                    <p className="text-[var(--red)] text-[10px] mt-1.5 ml-1 font-medium flex items-center gap-1">
                      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2.5 ml-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={handlePasswordFocus}
                      onBlur={handlePasswordBlur}
                      className={`input-field pr-12 transition-all duration-200 ${passwordBorderClass}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter & Rules */}
                  {(passwordFocused || (passwordTouched && !allPasswordRulesPassed)) && formData.password && (
                    <div className="mt-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3 transition-all duration-300">
                      {/* Strength Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Strength</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: passwordStrength.color }}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className="h-1.5 flex-1 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: level <= passwordStrength.score
                                  ? passwordStrength.color
                                  : 'var(--border)',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Rules Checklist */}
                      <div className="space-y-1">
                        {PASSWORD_RULES.map((rule) => {
                          const passed = rule.test(formData.password);
                          return (
                            <div key={rule.key} className="flex items-center gap-2">
                              {passed ? (
                                <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                                </svg>
                              )}
                              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                                passed ? 'text-emerald-500' : 'text-[var(--text-muted)]'
                              }`}>
                                {rule.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2.5 ml-1">Account Type</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field cursor-pointer"
                  >
                    <option value="Member" className="bg-[var(--bg-base)]">Member (Project Access)</option>
                    <option value="Admin" className="bg-[var(--bg-base)]">Admin (Full Management)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full h-14 mt-4"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>


            </div>
          </div>
          
          <p className="mt-10 text-center text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em]">
            Secured by Taskr Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
