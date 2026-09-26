import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail } from 'lucide-react';
import { Button, Input, Alert } from '../../components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <p className="text-slate-900 font-bold text-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>CampusGuard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <Mail size={28} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>Check your email</h2>
                <p className="text-slate-500 text-sm mt-2">
                  If an account with <strong>{email}</strong> exists, we've sent a password reset link. Please check your inbox.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/login" className="text-sm text-indigo-600 hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>Reset password</h2>
                <p className="text-slate-500 text-sm mt-1">Enter your email and we'll send you a reset link.</p>
              </div>

              {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@campusguard.edu"
                />
                <Button type="submit" loading={loading} className="w-full justify-center py-2.5">
                  {loading ? 'Sending…' : 'Send reset link'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1">
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
