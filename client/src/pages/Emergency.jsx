import React, { useState } from 'react';
import { 
  PhoneCall, 
  MapPin, 
  Share2, 
  HeartPulse, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare,
  Copy,
  Info,
  LifeBuoy
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Emergency() {
  const [gpsLocation, setGpsLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [copied, setCopied] = useState(false);
  const [locError, setLocError] = useState('');

  const emergencyContacts = [
    {
      title: 'Kumbh Mela 24/7 Ambulance',
      number: '108',
      desc: 'Free emergency medical ambulance & field paramedic dispatch',
      color: 'bg-rose-600 hover:bg-rose-700 text-white',
      badge: 'Critical Medical'
    },
    {
      title: 'National Emergency Helpline',
      number: '112',
      desc: 'Integrated police, fire, rescue, and disaster management response',
      color: 'bg-red-700 hover:bg-red-800 text-white',
      badge: 'Police & Rescue'
    },
    {
      title: 'Nashik Mela Disaster Control Room',
      number: '1077',
      desc: 'Nashik Ramkund & Trimbakeshwar command center, crowd monitoring & lost pilgrims support',
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
      badge: 'Disaster Control'
    },
    {
      title: 'Maharashtra State Relief Helpline',
      number: '1070',
      desc: 'Maharashtra state disaster management authority & emergency administrative assistance',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      badge: 'State Relief'
    },
    {
      title: 'Women Safety Helpline',
      number: '1090',
      desc: '24/7 dedicated support & safety assistance for female pilgrims',
      color: 'bg-purple-600 hover:bg-purple-700 text-white',
      badge: 'Women Safety'
    },
    {
      title: 'Pilgrim Health Inquiries',
      number: '104',
      desc: 'National health advisory & medical consultation helpline',
      color: 'bg-teal-600 hover:bg-teal-700 text-white',
      badge: 'Health Info'
    }
  ];

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setGettingLocation(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6)
        };
        setGpsLocation(coords);
        setGettingLocation(false);
      },
      (err) => {
        setGettingLocation(false);
        setLocError('Could not fetch GPS location. Please check your browser location permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const mapLink = gpsLocation 
    ? `https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}` 
    : '';

  const shareText = encodeURIComponent(
    `🚨 EMERGENCY: I am at Kumbh Mela and need assistance.\n` +
    `📍 My GPS Location: https://maps.google.com/?q=${gpsLocation?.lat},${gpsLocation?.lng}\n` +
    `Coordinates: ${gpsLocation?.lat}, ${gpsLocation?.lng}`
  );

  const whatsappShareUrl = `https://wa.me/?text=${shareText}`;
  const smsShareUrl = `sms:?body=${shareText}`;

  const copyToClipboard = () => {
    if (mapLink) {
      navigator.clipboard.writeText(mapLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Red Emergency Header Alert */}
        <div className="bg-red-600 text-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-red-950/20 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-pulse">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Kumbh Mela Emergency Center
          </h1>
          <p className="text-red-100 text-sm sm:text-base max-w-xl mx-auto">
            Immediate assistance protocols for pilgrims. In life-threatening emergencies, dial the official helplines below directly.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-800/80 text-white text-xs font-semibold">
            <Info className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Official Government Emergency Infrastructure — 24/7 Active</span>
          </div>
        </div>

        {/* 4 Emergency Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Action 1: Instant Medical Call */}
          <div className="bg-white rounded-3xl p-6 border-2 border-rose-200 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <HeartPulse className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-gray-900">1. Instant Medical Ambulance</h2>
              <p className="text-xs text-gray-600">
                Call the official Kumbh field ambulance network. Paramedic units are deployed across all mela sectors.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="tel:108"
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition active:scale-[0.98]"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                <span>Call 108 (Free 24/7)</span>
              </a>
            </div>
          </div>

          {/* Action 2: Find Nearest Medical Booth */}
          <div className="bg-white rounded-3xl p-6 border-2 border-teal-200 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <MapPin className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-gray-900">2. Find Nearest Medical Booth</h2>
              <p className="text-xs text-gray-600">
                Get GPS walking directions and contact numbers for the closest first-aid tent and hospital triage booth.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/health"
                className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-700/30 transition active:scale-[0.98]"
              >
                <HeartPulse className="w-5 h-5" />
                <span>Open Health Directory</span>
              </Link>
            </div>
          </div>

          {/* Action 3: Live GPS Location Sharing */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md md:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">3. Share Live Location with Family / Police</h2>
                    <p className="text-xs text-gray-500">Capture exact GPS coordinates to send via WhatsApp or SMS in case of getting separated.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleShareLocation}
                disabled={gettingLocation}
                className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <MapPin className={`w-4 h-4 ${gettingLocation ? 'animate-spin' : ''}`} />
                <span>{gettingLocation ? 'Acquiring GPS...' : gpsLocation ? 'Update Coordinates' : 'Acquire My Location'}</span>
              </button>
            </div>

            {locError && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-200">{locError}</p>
            )}

            {gpsLocation && (
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-gray-800">
                    <span className="font-bold">GPS Coordinates: </span>
                    <span className="font-mono">{gpsLocation.lat}, {gpsLocation.lng}</span>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-sm"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Link!' : 'Copy Map Link'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Send GPS via WhatsApp</span>
                  </a>

                  <a
                    href={smsShareUrl}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Send GPS via SMS</span>
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Action 4: Directory of Official Kumbh Helplines */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">4. Official Kumbh Helpline Directory</h2>
              <p className="text-xs text-gray-500 mt-0.5">Toll-free 24/7 dedicated numbers authorized by Kumbh Administration.</p>
            </div>
            <LifeBuoy className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-600 uppercase bg-gray-200/80 px-2 py-0.5 rounded">
                      {contact.badge}
                    </span>
                    <span className="text-lg font-black font-mono text-gray-900">{contact.number}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{contact.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{contact.desc}</p>
                </div>

                <a
                  href={`tel:${contact.number}`}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${contact.color}`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {contact.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
