import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Flame, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Building2, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Register = () => {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(searchParams.get('role') === 'owner' ? 'owner' : 'pilgrim');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (searchParams.get('role') === 'owner') {
      setRole('owner');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!name || !email || !phone || !password) {
      setLocalError('Please fill out all registration fields.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        phone,
        password,
        role,
      });
      navigate(role === 'owner' ? '/for-owners' : '/stays');
    } catch (err) {
      setLocalError(err.message || 'Registration failed. Please review your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-sm mb-4">
            <Flame className="w-7 h-7 text-amber-200 fill-amber-200" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Your KumbhStay Account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the verified pilgrimage network for safe accommodation and transparent booking.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            I am joining as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('pilgrim')}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                role === 'pilgrim'
                  ? 'border-orange-500 bg-orange-50/70 text-orange-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                role === 'pilgrim' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">Pilgrim / Yatri</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Looking for verified stays</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('owner')}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                role === 'owner'
                  ? 'border-orange-500 bg-orange-50/70 text-orange-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                role === 'owner' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">Stay Owner / Host</p>
                <p className="text-[11px] text-slate-500 mt-0.5">List & verify properties</p>
              </div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(localError || error) && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm text-slate-800 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
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

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm text-slate-800 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password (min. 6 characters)
            </label>
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
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700">
            Sign In Here
          </Link>
        </div>

        {/* Privacy Note */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          By registering, you agree to the KumbhStay Fair Tariff & Verification Guidelines. Passwords are securely hashed with bcrypt.
        </div>
      </div>
    </div>
  );
};

export default Register;
