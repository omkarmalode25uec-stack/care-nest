import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, Sparkles } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getNextDayString = (dateString) => {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('-').map(Number);
  const nextDate = new Date(y, m - 1, d + 1);
  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, '0');
  const day = String(nextDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const SearchBar = ({ className = '', initialValues = {} }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const todayStr = getTodayString();
  const [location, setLocation] = useState(initialValues.location || 'Nashik');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || '');
  const [guests, setGuests] = useState(initialValues.guests || '2');
  const [occupancy, setOccupancy] = useState(initialValues.occupancy || 'all');

  const handleCheckInChange = (newVal) => {
    setCheckIn(newVal);
    if (!newVal) return;
    const nextDay = getNextDayString(newVal);
    if (!checkOut || checkOut <= newVal) {
      setCheckOut(nextDay);
    }
  };

  const handleCheckOutChange = (newVal) => {
    if (checkIn && newVal <= checkIn) {
      setCheckOut(getNextDayString(checkIn));
    } else {
      setCheckOut(newVal);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location && location !== 'all') params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    if (occupancy && occupancy !== 'all') params.set('occupancy', occupancy);

    navigate(`/stays?${params.toString()}`);
  };

  const minCheckOut = checkIn ? getNextDayString(checkIn) : todayStr;

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-2xl shadow-lg border border-slate-200/90 p-3 sm:p-4 transition-all hover:shadow-xl ${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* 1. Destination / Sector Selector (4 Cols) */}
        <div className="lg:col-span-4 flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-orange-400 focus-within:border-orange-500 focus-within:bg-white transition-all">
          <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {t('filter_destination', 'Destination / Ghat')}
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer truncate"
            >
              <option value="Nashik">All Nashik (Holy Godavari Confluence)</option>
              <option value="Panchavati">Panchavati (Ramkund & Kalaram Mandir)</option>
              <option value="Trimbakeshwar">Trimbakeshwar (Kushavarta Kund & Jyotirlinga)</option>
              <option value="Tapovan">Tapovan (Kapila-Godavari Sangam)</option>
              <option value="CBS">CBS Transit Hub (Central Bus Station)</option>
            </select>
          </div>
        </div>

        {/* 2. Check-in Date (2.5 Cols) */}
        <div className="lg:col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-orange-400 focus-within:border-orange-500 focus-within:bg-white transition-all">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {t('search_checkin', 'Check-in')}
            </label>
            <input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Check-out Date (2.5 Cols) */}
        <div className="lg:col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-orange-400 focus-within:border-orange-500 focus-within:bg-white transition-all">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {t('search_checkout', 'Check-out (+1d min)')}
            </label>
            <input
              type="date"
              min={minCheckOut}
              value={checkOut}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Guests & Stay Type (3 Cols with CTA) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row items-stretch gap-2">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-orange-400 focus-within:border-orange-500 focus-within:bg-white transition-all flex-1">
            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {t('search_guests', 'Yatris / Type')}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="1">1 Pilgrim (Solo)</option>
                <option value="2">2 Pilgrims (Couple)</option>
                <option value="3">3 Pilgrims (Family)</option>
                <option value="4">4+ Pilgrims (Family Group)</option>
                <option value="8">8+ Pilgrims (Satsang Group)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{t('search_button', 'Search Stays')}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
