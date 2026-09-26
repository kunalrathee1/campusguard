import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';

export function NotFound() {
  const { role } = useAuth();
  const home = role === 'admin' ? '/admin/dashboard' : role === 'faculty' ? '/faculty/dashboard' : role === 'student' ? '/student/dashboard' : '/login';
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-3xl font-bold text-slate-400">4</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>404</h1>
        <p className="text-slate-600 font-medium">Page not found</p>
        <p className="text-slate-400 text-sm max-w-xs">The page you're looking for doesn't exist or has been moved.</p>
        <Link to={home}><Button variant="primary">Go to Dashboard</Button></Link>
      </div>
    </div>
  );
}

export function Forbidden() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
          <Shield size={28} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>403</h1>
        <p className="text-slate-600 font-medium">Access Denied</p>
        <p className="text-slate-400 text-sm max-w-xs">You don't have permission to access this page. Please contact your administrator.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}
