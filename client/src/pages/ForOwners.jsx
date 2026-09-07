import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Flame,
  Award
} from 'lucide-react';

export const ForOwners = () => {
  const benefits = [
    {
      title: 'Verified Pilgrim Demand',
      description: 'Connect directly with thousands of families, groups, and pilgrims seeking verified stays during Kumbh Mela.',
      icon: Users,
    },
    {
      title: 'KumbhStay Trust Badge',
      description: 'Receive the official KumbhStay Trust Badge after free physical inspection, boosting your booking conversions.',
      icon: Award,
    },
    {
      title: 'Guaranteed Fair Payouts',
      description: 'Transparent commission rates, direct bank settlements, and protected booking cancellations.',
      icon: DollarSign,
    },
    {
      title: 'Dedicated Ground Support',
      description: 'Our zonal coordinators assist you with check-in operations and route guidance for incoming pilgrims.',
      icon: ShieldCheck,
    },
  ];

  const onboardingSteps = [
    {
      step: '01',
      title: 'Register as Property Owner',
      desc: 'Create your owner account with contact phone and business/host identity.',
    },
    {
      step: '02',
      title: 'Submit Property Details',
      desc: 'Add room types, bed capacities, amenities (hot water, AC, food), and standard tariffs.',
    },
    {
      step: '03',
      title: 'Schedule Ground Audit',
      desc: 'Our zonal coordinator conducts an on-ground physical inspection and takes verified photos.',
    },
    {
      step: '04',
      title: 'Go Live & Accept Yatris',
      desc: 'Your property goes live with the Trust Badge and verified distance to Snan Ghats.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            Host & Ashram Partner Program
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            List Your Stay on KumbhStay
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Welcome yatris to honest, verified lodging. Join hands with the official trust initiative for Kumbh Mela accommodations.
          </p>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              to="/register?role=owner"
              className="px-6 py-3.5 bg-white text-orange-700 font-bold text-sm rounded-xl shadow-md hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <span>Register Property</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 bg-orange-800/60 hover:bg-orange-800 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors"
            >
              Owner Login
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Host With KumbhStay?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We empower local homeowners, hotels, and religious institutions to serve pilgrims with integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-200 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Step Onboarding */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Seamless Onboarding
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            How to Get Verified & Listed
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {onboardingSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-xl font-black text-orange-500 font-mono">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-white mt-3 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForOwners;
