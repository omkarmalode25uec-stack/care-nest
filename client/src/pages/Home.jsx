import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Star, 
  Compass, 
  Languages, 
  Filter,
  Hotel, 
  Bed, 
  Home as HomeIcon, 
  Building, 
  CheckCircle2, 
  ArrowRight,
  HeartHandshake,
  Clock,
  PhoneCall,
  Flame,
  Award
} from 'lucide-react';
import SearchBar from '../components/SearchBar';

export const Home = () => {
  const whyCards = [
    {
      title: 'Verified Properties',
      description: 'Physical audit and authentic photos ensure what you see is exactly what you get upon arrival.',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Transparent Pricing',
      description: 'Zero hidden surge fees. Direct per-night pricing with guaranteed reservation protection for snan days.',
      icon: DollarSign,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
    },
    {
      title: 'Real Reviews',
      description: 'Authentic feedback exclusively submitted by pilgrims who completed verified bookings.',
      icon: Star,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Location Verification',
      description: 'Exact walking and shuttle distances to Ramkund, Kushavarta Kund, and major sacred Godavari snan ghats in Nashik.',
      icon: Compass,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Pilgrim-friendly Filters',
      description: 'Filter by sattvic pure veg food, hot water 24/7, ground floor access, and family dorms.',
      icon: Filter,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      title: 'Multilingual Assistance',
      description: 'Dedicated support available in Hindi, Marathi, Bengali, Tamil, Telugu, and English.',
      icon: Languages,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
  ];

  const propertyTypes = [
    {
      type: 'Hotel',
      tagline: 'Private AC & Non-AC Rooms',
      description: 'Full-service hotels with attached bathrooms, 24/7 power backup, and front-desk assistance.',
      icon: Hotel,
      badge: 'Popular for Families',
      link: '/stays?type=hotel',
    },
    {
      type: 'Hostel',
      tagline: 'Clean Pilgrim Dorms',
      description: 'Budget-friendly shared accommodations with personal lockers and community satsang spaces.',
      icon: Bed,
      badge: 'Budget Choice',
      link: '/stays?type=hostel',
    },
    {
      type: 'PG',
      tagline: 'Paying Guest Stays',
      description: 'Quiet, residential rooms in nearby neighborhoods with flexible stay durations for kalpvasi pilgrims.',
      icon: Building,
      badge: 'Longer Stays',
      link: '/stays?type=pg',
    },
    {
      type: 'Homestay',
      tagline: 'Local Family Hospitality',
      description: 'Warm local hospitality with authentic sattvic home-cooked meals and local route guidance.',
      icon: HomeIcon,
      badge: 'Authentic Warmth',
      link: '/stays?type=homestay',
    },
  ];

  const trustSteps = [
    {
      step: '01',
      title: 'Owner Verification',
      description: 'We authenticate government ID, ownership documentation, and contact details of every property host.',
      icon: HeartHandshake,
    },
    {
      step: '02',
      title: 'Property Verification',
      description: 'Our ground coordinators inspect hygiene, bedding, hot water availability, and safety infrastructure.',
      icon: CheckCircle2,
    },
    {
      step: '03',
      title: 'Location Verification',
      description: 'We log exact GeoJSON GPS coordinates and audit real pedestrian distances to Mela sectors and Ghats.',
      icon: MapPin,
    },
    {
      step: '04',
      title: 'Pilgrim Reviews & Feedback',
      description: 'Post-stay audits ensure hosts maintain hygiene and promised tariffs throughout the peak Snan dates.',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-orange-50/60 via-amber-50/30 to-slate-50 border-b border-orange-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-orange-700 border border-orange-200 shadow-xs mb-6">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>Nashik Kumbh Mela Verified Accommodation Platform</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Find a Stay You Can <span className="text-orange-600 underline decoration-amber-400 decoration-wavy decoration-2">Trust</span> in Nashik
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Verified stays, transparent pricing and location-aware information for pilgrims visiting sacred snan ghats.
          </p>

          {/* Search Box */}
          <div className="mt-8 sm:mt-12 max-w-5xl mx-auto">
            <SearchBar />
          </div>

          {/* Quick Trust Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Physical Address Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Last-Minute Price Inflation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ghat Proximity & Shuttle Route Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Care Nest? Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Why Choose Us
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Pilgrims Rely on Care Nest
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Finding honest lodging in peak festival crowds shouldn't be stressful. Here is how we protect every pilgrim's sacred journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-orange-200 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Explore by Property Type */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 mb-3">
            <Hotel className="w-3.5 h-3.5 text-amber-700" />
            Accommodations
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore by Property Type
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Choose from a wide spectrum of verified stays tailored for solo pilgrims, elderly parents, and family groups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {propertyTypes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.link}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {item.type}
                  </h3>
                  <p className="text-xs font-semibold text-orange-700 mt-0.5 mb-2">
                    {item.tagline}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
                  <span>Browse Stays</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. How Care Nest Builds Trust (4 Steps) */}
      <section className="bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600/30 text-orange-300 border border-orange-500/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              Our 4-Layer Verification
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How Care Nest Builds Trust
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Every single listing passes through our multi-point verification protocol before receiving the Care Nest Trust Badge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-black text-orange-500 font-mono">
                        {step.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-amber-400">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Enforced Standard</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Owner Registration CTA */}
          <div className="mt-16 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 text-center max-w-4xl mx-auto shadow-xl">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Are you a Stay Owner or Ashram Administrator?
            </h3>
            <p className="mt-2 text-white/90 text-sm max-w-xl mx-auto">
              Join the official Care Nest trust network. Undergo free physical verification and welcome verified pilgrims with honest tariffs.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/register?role=owner"
                className="px-6 py-3 bg-white text-orange-700 font-bold text-sm rounded-xl hover:bg-orange-50 transition-colors shadow-sm"
              >
                List Your Property
              </Link>
              <Link
                to="/for-owners"
                className="px-6 py-3 bg-orange-700/60 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors"
              >
                Learn Verification Requirements
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pilgrim Safety & Emergency Info Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30">
              <Clock className="w-3.5 h-3.5" />
              24/7 Pilgrim Medical & Emergency Support
            </div>
            <h3 className="text-xl font-bold text-white">
              Need immediate medical aid or emergency helpline assistance?
            </h3>
            <p className="text-sm text-teal-100/80 max-w-xl">
              Access GPS-enabled Kumbh medical booth locators, hospital triage routing, ambulance dispatch contacts, and instant live GPS sharing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/health"
              className="flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-teal-950/40"
            >
              <span>🏥 Health Assistance</span>
            </Link>
            <Link
              to="/emergency"
              className="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-rose-950/40"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>🚨 Emergency 108 / 112</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
