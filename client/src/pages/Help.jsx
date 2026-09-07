import React, { useState } from 'react';
import { 
  HelpCircle, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Flame, 
  HeartHandshake,
  MessageSquare
} from 'lucide-react';

export const Help = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'What does "Care Nest Verified" mean?',
      a: 'It means our ground team has physically inspected the property, confirmed authentic ownership, verified exact GPS walking distance to Snan Ghats, and ensured the published tariffs are binding without surge pricing.',
    },
    {
      q: 'How do I reach my stay during peak Snan traffic restrictions?',
      a: 'During primary Shahi Snan dates, local police enforce vehicle restrictions in core mela sectors. Every Care Nest listing includes specific sector gate numbers, pontoon bridge paths, and authorized electric shuttle drop points.',
    },
    {
      q: 'What if a host demands higher cash payments upon check-in?',
      a: 'This is strictly prohibited under our Fair Tariff Charter. Contact our 24/7 Pilgrim Grievance cell immediately at +91 1800-CARE-NEST with your booking ID, and our on-ground nodal coordinator will resolve it within 30 minutes.',
    },
    {
      q: 'Are sattvic vegetarian meals and 24/7 hot water available?',
      a: 'Yes, you can use our pilgrim-friendly filters to select properties offering 100% pure vegetarian / sattvic food and continuous hot water for early morning sacred dips.',
    },
    {
      q: 'How does cancellation work if train schedules change?',
      a: 'All verified stays offer standardized pilgrimage cancellation policies with clear refund timelines if railway or administrative schedules change.',
    },
  ];

  const emergencyContacts = [
    { name: 'Care Nest 24x7 Pilgrim Helpline', number: '+91 1800 200 2027', type: 'Support & Grievances' },
    { name: 'Mela Central Police Control Room', number: '112 / 100', type: 'Police & Security' },
    { name: 'Emergency Medical & Ambulance Service', number: '108', type: 'Healthcare' },
    { name: 'Lost & Found Pilgrim Center (Ramkund / Panchavati)', number: '+91 0253 250011', type: 'Assistance' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
          <HelpCircle className="w-4 h-4 text-orange-600" />
          Pilgrim Assistance Desk
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How Can We Help You?
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Find answers to frequently asked questions about verified stays, Ghat distances, safety guidelines, and emergency assistance.
        </p>
      </div>

      {/* Emergency Assistance Box */}
      <div className="bg-red-50/80 rounded-3xl p-6 sm:p-8 border border-red-200/80 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-950">
              Emergency Assistance & Official Helplines
            </h3>
            <p className="text-xs text-red-800">
              Direct emergency contact numbers for medical, police, and pilgrim assistance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-xs"
            >
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">{contact.name}</p>
                <p className="text-[11px] text-slate-500">{contact.type}</p>
              </div>
              <a
                href={`tel:${contact.number.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{contact.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <span className="p-1 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Help;
