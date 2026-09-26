import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Alert } from '../../components/ui';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Login failed');
      return;
    }
    // Navigate based on role stored in context
    const stored = localStorage.getItem('campusguard_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    }
  };

  const fillDemo = (role: 'admin' | 'faculty' | 'student') => {
    const creds = {
      admin: { email: 'admin@campusguard.edu', password: 'Admin@123' },
      faculty: { email: 'faculty@campusguard.edu', password: 'Faculty@123' },
      student: { email: 'student@campusguard.edu', password: 'Student@123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    setFieldErrors({});
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white" style={{ width: 200 + i * 120, height: 200 + i * 120, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>CampusGuard</p>
              <p className="text-slate-400 text-xs">Attendance & Early Warning System</p>
            </div>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Smart Attendance<br />Management
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Monitor attendance in real-time, identify at-risk students early, and take action before issues escalate.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Students', value: '20' },
              { label: 'Avg Attendance', value: '74%' },
              { label: 'Warnings Issued', value: '8' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>{stat.value}</p>
                <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-slate-600 text-xs">© 2024 CampusGuard. All rights reserved.</p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <p className="text-slate-900 font-bold text-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>CampusGuard</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>Welcome back</h2>
              <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
            </div>

            {/* Demo credential quick-fill */}
            <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 mb-2">Demo Credentials</p>
              <div className="flex gap-2 flex-wrap">
                {(['admin', 'faculty', 'student'] as const).map(role => (
                  <button key={role} onClick={() => fillDemo(role)} className="px-3 py-1.5 text-xs bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition capitalize font-medium">
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }}
                placeholder="you@campusguard.edu"
                error={fieldErrors.email}
                autoComplete="email"
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full rounded-lg border ${fieldErrors.password ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500'} bg-white px-3 py-2 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent`}
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 accent-indigo-600 rounded" />
                <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
              </div>

              <Button type="submit" loading={loading} className="w-full justify-center py-2.5">
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
