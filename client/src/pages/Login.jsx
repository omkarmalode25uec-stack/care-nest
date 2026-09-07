import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Flame, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Login = () => {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-sm mb-4">
            <Flame className="w-7 h-7 text-amber-200 fill-amber-200" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back to Care Nest
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your verified bookings, property listings, and saved stays.
          </p>
        </div>

        {/* Error Alert */}
        {(localError || error) && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pilgrim@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm text-slate-800 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <Link to="/help" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm text-slate-800 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Logins */}
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              🚀 1-Click Demo Logins
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
              Instant Fill
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('pilgrim.demo@carenest.com');
                setPassword('Pilgrim@123');
              }}
              className="py-2 px-2 bg-white hover:bg-amber-100/60 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl transition text-center shadow-xs"
            >
              🙏 Pilgrim
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('owner.demo@carenest.com');
                setPassword('Owner@123');
              }}
              className="py-2 px-2 bg-white hover:bg-amber-100/60 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl transition text-center shadow-xs"
            >
              🏡 Host / Owner
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin.demo@carenest.com');
                setPassword('Admin@123');
              }}
              className="py-2 px-2 bg-white hover:bg-amber-100/60 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl transition text-center shadow-xs"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-2 text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700">
            Register for Free
          </Link>
        </div>

        {/* Security badge */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted with JWT & bcrypt security</span>
        </div>
      </div>
    </div>
  );
};


export default Login;
