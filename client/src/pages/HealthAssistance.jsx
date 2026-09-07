import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  MapPin, 
  Phone, 
  Navigation, 
  Cross, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  ShieldAlert, 
  Activity,
  Locate,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMedicalPoints } from '../services/medicalService';

export default function HealthAssistance() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & State
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCity, setSelectedCity] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  // Pilgrim Triage Flow Modal / State
  const [showTriage, setShowTriage] = useState(false);
  const [triageStep, setTriageStep] = useState(1);
  const [canWalk, setCanWalk] = useState(null);

  const fetchPoints = async (coords = null, city = selectedCity, type = selectedType, q = search) => {
    try {
      setLoading(true);
      const params = {};
      if (q) params.search = q;
      if (city) params.city = city;
      if (type && type !== 'All') params.type = type;
      if (coords) {
        params.lat = coords.lat;
        params.lng = coords.lng;
      }
      const data = await getMedicalPoints(params);
      setPoints(data);
    } catch (err) {
      setError('Failed to load medical facilities. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints(userLocation, selectedCity, selectedType, search);
  }, [selectedCity, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPoints(userLocation, selectedCity, selectedType, search);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
        setLocating(false);
        fetchPoints(coords, selectedCity, selectedType, search);
      },
      (err) => {
        setLocating(false);
        // Default to Ramkund coordinates for Nashik
        const defaultCoords = { lat: 20.0063, lng: 73.7915 };
        setUserLocation(defaultCoords);
        fetchPoints(defaultCoords, selectedCity, selectedType, search);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const types = ['All', 'Medical Booth', 'Hospital', 'Ambulance Point', 'First Aid'];
  const sectorsAndCities = [
    { label: 'All Locations', value: '' },
    { label: 'Nashik (Panchavati / Ramkund)', value: 'Nashik' },
    { label: 'Trimbakeshwar (Kushavarta Kund)', value: 'Trimbakeshwar' },
  ];

  const nearestPoint = points.length > 0 ? points[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 via-white to-gray-50/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-teal-950/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-bold uppercase tracking-wider">
              <HeartPulse className="w-4 h-4 text-teal-300" />
              <span>Kumbh Mela Health Network</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              24/7 Pilgrim Health & Medical Assistance
            </h1>
            
            <p className="text-teal-100/90 text-sm sm:text-base leading-relaxed">
              Find verified medical booths, first-aid centers, hospital triage units, and ambulance points across the Kumbh Mela sectors and sacred ghats.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => { setShowTriage(true); setTriageStep(1); setCanWalk(null); }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-900/30 transition flex items-center gap-2 active:scale-[0.98]"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>I Need Medical Help (Triage)</span>
              </button>

              <Link
                to="/emergency"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-2xl transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-rose-400" />
                <span>Emergency Helplines</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Triage Modal / Card */}
        {showTriage && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowTriage(false)}
              className="absolute top-4 right-4 text-rose-400 hover:text-rose-700 text-sm font-bold bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
            >
              ✕
            </button>

            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-rose-950">Pilgrim Symptom & Emergency Triage</h3>
                  <p className="text-xs text-rose-700">Quick assessment to guide you to the right help immediately.</p>
                </div>
              </div>

              {triageStep === 1 && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm font-bold text-rose-900">
                    Are you or the pilgrim able to walk, or is this a severe / immobility emergency?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => { setCanWalk(true); setTriageStep(2); }}
                      className="p-4 bg-white rounded-2xl border-2 border-teal-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition flex items-start gap-3 shadow-sm group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Can Walk / Minor Condition</p>
                        <p className="text-xs text-gray-500 mt-0.5">Mild injury, dehydration, dizziness, dressing, blister, heat exhaustion.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { setCanWalk(false); setTriageStep(2); }}
                      className="p-4 bg-white rounded-2xl border-2 border-rose-300 hover:border-rose-600 hover:bg-rose-100/50 text-left transition flex items-start gap-3 shadow-sm group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
                        🚨
                      </div>
                      <div>
                        <p className="font-bold text-rose-950 text-sm">Severe / Cannot Move</p>
                        <p className="text-xs text-rose-700 mt-0.5">Chest pain, unconsciousness, heavy fracture, acute breathing difficulty.</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {triageStep === 2 && canWalk === true && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-white rounded-2xl border border-teal-200 text-sm text-gray-800 space-y-2">
                    <p className="font-bold text-teal-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" /> Recommended Action: Visit Nearest Medical Booth
                    </p>
                    <p className="text-xs text-gray-600">
                      You can walk to the nearest Kumbh Sector Medical Booth for free consultation, hydration ORS, first-aid dressing, and basic medications.
                    </p>
                    {nearestPoint && (
                      <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-gray-900">{nearestPoint.name}</p>
                          <p className="text-xs text-gray-500">{nearestPoint.address} {nearestPoint.distanceKm ? `(${nearestPoint.distanceKm} km away)` : ''}</p>
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${nearestPoint.latitude},${nearestPoint.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-sm shrink-0"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Start Walking Route
                        </a>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setTriageStep(1)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 underline"
                  >
                    ← Back to Question
                  </button>
                </div>
              )}

              {triageStep === 2 && canWalk === false && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-rose-100/80 rounded-2xl border border-rose-300 text-rose-950 space-y-3">
                    <p className="font-black text-base flex items-center gap-2 text-rose-900">
                      <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" /> Emergency Protocol: Call 108 Ambulance Immediately
                    </p>
                    <p className="text-xs text-rose-800">
                      Do not try to walk. Stay in place, keep the pilgrim calm and hydrated if conscious, and contact Kumbh Emergency control.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href="tel:108"
                        className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-xl inline-flex items-center gap-2 shadow-lg shadow-rose-600/30"
                      >
                        <Phone className="w-4 h-4" /> Call 108 Ambulance Now
                      </a>
                      <a
                        href="tel:112"
                        className="px-5 py-3 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl inline-flex items-center gap-2 shadow-sm"
                      >
                        <Phone className="w-4 h-4 text-amber-400" /> Call 112 Police / Rescue
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => setTriageStep(1)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 underline"
                  >
                    ← Back to Question
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location Selector & Search Controls */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* GPS Trigger */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleGetLocation}
                disabled={locating}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-2xl transition active:scale-95"
              >
                <Locate className={`w-4 h-4 text-teal-600 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Detecting Location...' : userLocation ? 'Location Active (Nearest First)' : 'Find Nearest to My Location'}</span>
              </button>

              {userLocation && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ✓ GPS Set
                </span>
              )}
            </div>

            {/* City/Sector Dropdown */}
            <div className="w-full md:w-64">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {sectorsAndCities.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {geoError && (
            <p className="text-xs text-amber-700 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              {geoError}
            </p>
          )}

          {/* Search bar & Type Pills */}
          <div className="pt-2 border-t border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search booth, hospital, sector, or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </form>

            {/* Type tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedType === t 
                      ? 'bg-teal-700 text-white shadow-sm' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Medical Facilities Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Verified Medical Facilities</span>
              <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                {points.length} Available
              </span>
            </h2>
            <span className="text-xs text-gray-400 font-medium">Free medical care under Kumbh Health Administration</span>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent"></div>
              <p className="text-xs text-gray-500 font-medium">Locating medical facilities...</p>
            </div>
          ) : points.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center max-w-md mx-auto">
              <HeartPulse className="w-12 h-12 text-teal-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">No medical points found</h3>
              <p className="text-xs text-gray-500 mt-1">Try resetting your search query or selecting "All Locations".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {points.map((p) => {
                const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;
                
                const typeColors = {
                  'Medical Booth': 'bg-teal-50 text-teal-700 border-teal-200',
                  'Hospital': 'bg-blue-50 text-blue-700 border-blue-200',
                  'Ambulance Point': 'bg-rose-50 text-rose-700 border-rose-200',
                  'First Aid': 'bg-emerald-50 text-emerald-700 border-emerald-200'
                };

                return (
                  <div 
                    key={p._id}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${typeColors[p.type] || 'bg-gray-100 text-gray-700'}`}>
                          {p.type}
                        </span>

                        {p.distanceKm !== undefined && (
                          <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-amber-600" />
                            {p.distanceKm} km away
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-gray-900 leading-snug">{p.name}</h3>

                      <p className="text-xs text-gray-500 flex items-start gap-1 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span>{p.address}, {p.city} {p.sector ? `(${p.sector})` : ''}</span>
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{p.operatingHours || '24/7 Hours'}</span>
                        {p.hasAmbulanceBay && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                            🚑 Ambulance Bay
                          </span>
                        )}
                      </div>

                      {/* Services list */}
                      {p.services && p.services.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {p.services.map((s, idx) => (
                            <span key={idx} className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${p.phone}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition border border-emerald-200"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call</span>
                      </a>

                      <a
                        href={mapDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Directions</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
