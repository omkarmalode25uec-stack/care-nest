import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Flame, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Home as HomeIcon,
  Search,
  HelpCircle,
  Building2,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  HeartPulse,
  AlertTriangle,
  CalendarCheck
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: t('nav_find_stays', 'Find Stays'), path: '/stays' },
    { name: t('nav_health', 'Health Assistance'), path: '/health', isHealth: true },
    { name: t('nav_emergency', 'Emergency'), path: '/emergency', isEmergency: true },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: t('nav_my_bookings', 'My Bookings'), path: '/bookings/my' });
  }

  if (isAuthenticated && user?.role === 'admin') {
    navLinks.push(
      { name: t('nav_admin_portal', 'Admin Portal'), path: '/admin/dashboard' },
      { name: t('nav_owner_portal', 'Owner Portal'), path: '/owner/dashboard' }
    );
  } else if (isAuthenticated && user?.role === 'owner') {
    navLinks.push({ name: t('nav_owner_portal', 'Owner Portal'), path: '/owner/dashboard' });
  } else {
    navLinks.push({ name: t('nav_for_owners', 'For Owners'), path: '/for-owners' });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-xs">
      {/* Top sacred banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
        <span>{t('sacred_banner', 'Kumbh Mela 2027 Verified Accommodations & Pilgrim Assistance')}</span>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm group-hover:bg-orange-700 transition-colors">
              <Flame className="w-6 h-6 text-amber-200 fill-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-slate-900 tracking-tight">Care <span className="text-orange-600">Nest</span></span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                  <ShieldCheck className="w-3 h-3 mr-0.5 text-orange-600" /> Trust
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">Trusted Pilgrim Stays</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => {
                  if (link.isEmergency) {
                    return `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      isActive
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    }`;
                  }
                  if (link.isHealth) {
                    return `inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-teal-700 bg-teal-50 font-bold'
                        : 'text-slate-700 hover:text-teal-700 hover:bg-teal-50/50'
                    }`;
                  }
                  return `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-orange-600 bg-orange-50 font-semibold'
                      : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`;
                }}
              >
                {link.isEmergency && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />}
                {link.isHealth && <HeartPulse className="w-4 h-4 text-teal-600" />}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>


          {/* Desktop Auth Buttons & Language Selector */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector variant="desktop" />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {user.role === 'owner' && (
                  <Link
                    to="/owner/properties/new"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-orange-600" />
                    <span>{t('nav_list_stay', 'List Stay')}</span>
                  </Link>
                )}

                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'owner' ? '/owner/dashboard' : '/stays'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <span className="text-[10px] capitalize text-orange-600 font-medium">
                      {user.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title={t('nav_logout', 'Logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-lg transition-colors"
                >
                  {t('nav_login', 'Login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs hover:shadow transition-all"
                >
                  {t('nav_register', 'Register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector variant="desktop" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-orange-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="pb-2">
            <LanguageSelector variant="mobile" />
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => {
                  if (link.isEmergency) {
                    return `flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-bold transition-all ${
                      isActive ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'
                    }`;
                  }
                  if (link.isHealth) {
                    return `flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-semibold transition-all ${
                      isActive ? 'bg-teal-700 text-white' : 'text-teal-800 hover:bg-teal-50'
                    }`;
                  }
                  return `block px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? 'text-orange-600 bg-orange-50 font-semibold'
                      : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`;
                }}
              >
                {link.isEmergency && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                {link.isHealth && <HeartPulse className="w-4 h-4 text-teal-600" />}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email} • <span className="capitalize text-orange-600 font-medium">{user.role}</span></p>
                  </div>
                </div>

                {user.role === 'owner' && (
                  <Link
                    to="/owner/properties/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200"
                  >
                    <PlusCircle className="w-4 h-4 text-orange-600" />
                    <span>{t('nav_list_stay', 'List New Stay')}</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav_logout', 'Logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {t('nav_login', 'Login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors"
                >
                  {t('nav_register', 'Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


export default Navbar;
