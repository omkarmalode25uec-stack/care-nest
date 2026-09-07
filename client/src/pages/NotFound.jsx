import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mx-auto">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <span className="text-4xl font-black text-orange-600 font-mono">404</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            The page you are looking for might have been moved, renamed, or is currently unavailable during Kumbh Mela updates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/stays"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Explore Stays</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
