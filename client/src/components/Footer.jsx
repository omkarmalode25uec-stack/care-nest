import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Flame, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Care <span className="text-orange-500">Nest</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Dedicated to providing verified, trustworthy accommodation and pilgrim assistance for Kumbh Mela. Transparent pricing, verified locations, and real pilgrim reviews.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Physical Verification Program
              </span>
            </div>
          </div>

          {/* Column 2: For Pilgrims */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Pilgrims</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/stays" className="hover:text-orange-400 transition-colors">Find Verified Stays</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-orange-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">Ghat Proximity Guide</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">Snan Dates & Timings</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">Emergency Assistance</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Owners & About */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Owners</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/for-owners" className="hover:text-orange-400 transition-colors">List Your Property</Link>
              </li>
              <li>
                <Link to="/for-owners" className="hover:text-orange-400 transition-colors">Verification Process</Link>
              </li>
              <li>
                <Link to="/for-owners" className="hover:text-orange-400 transition-colors">Fair Pricing Guidelines</Link>
              </li>
              <li>
                <Link to="/register?role=owner" className="hover:text-orange-400 transition-colors">Owner Registration</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">Safety & Verification</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">Help Center & FAQ</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">Safety & Verification</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">Pilgrim Grievance Cell</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Care Nest. All rights reserved. In service of Kumbh Mela Pilgrims.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with care & devotion</span>
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>for sacred pilgrimage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
