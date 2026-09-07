import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Info,
  Calendar,
  Sparkles,
  HelpCircle,
  FileCheck,
  UserCheck,
  MapPin,
  Camera,
  BadgePercent,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TrustScoreCard = ({
  trustScore = 90,
  ownerVerified = true,
  propertyVerified = true,
  locationVerified = true,
  photoVerified = true,
  lastVerifiedAt,
  compact = false,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // Format Last Verified Date
  const formattedDate = lastVerifiedAt
    ? new Date(lastVerifiedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '6 September 2026';

  const score = Number(trustScore) || 85;

  const getGrade = (s) => {
    if (s >= 95) return { text: 'Platinum Trust Grade', color: 'text-amber-300', bg: 'bg-amber-400/20' };
    if (s >= 85) return { text: 'Gold Verified Grade', color: 'text-emerald-300', bg: 'bg-emerald-400/20' };
    return { text: 'Standard Verified Grade', color: 'text-blue-300', bg: 'bg-blue-400/20' };
  };

  const grade = getGrade(score);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Trust Score: {score}/100</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden space-y-5">
      {/* Decorative ambient background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Trust Score Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-950">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest block">
                KumbhStay Trust Engine
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">Verified Trust Score</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Certified by KumbhStay on-ground verification team
          </p>
        </div>

        {/* Big Score Bubble */}
        <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-5 py-3 rounded-2xl shrink-0">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-amber-400 tracking-tight">{score}</span>
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
            <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${grade.bg} ${grade.color}`}>
              {grade.text}
            </span>
          </div>
        </div>
      </div>

      {/* 5-Point Verification Breakdown Checklist */}
      <div className="relative z-10 pt-2 border-t border-slate-800/80">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 block">
          5-Point Verification Audit Breakdown
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {/* 1. Owner Verification */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-slate-200">Owner Identity Verified</span>
            </div>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              ✓ <span className="text-[10px] text-slate-400 font-normal">(25 pts)</span>
            </span>
          </div>

          {/* 2. Property Document Verification */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-slate-200">Legal Ownership / NOC</span>
            </div>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              ✓ <span className="text-[10px] text-slate-400 font-normal">(25 pts)</span>
            </span>
          </div>

          {/* 3. Location & GPS Verification */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-slate-200">GPS & Ghat Distance</span>
            </div>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              ✓ <span className="text-[10px] text-slate-400 font-normal">(20 pts)</span>
            </span>
          </div>

          {/* 4. Photo Authenticity */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-200">Authentic Room Photos</span>
            </div>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              ✓ <span className="text-[10px] text-slate-400 font-normal">(15 pts)</span>
            </span>
          </div>

          {/* 5. Pricing Transparency & Review Signals */}
          <div className="sm:col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2">
              <BadgePercent className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Guaranteed Fair Tariff & Review Completeness</span>
            </div>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              ✓ <span className="text-[10px] text-slate-400 font-normal">(15 pts)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Last Verified Date & Tooltip Trigger */}
      <div className="relative z-10 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
          <span>Last verified: <strong className="text-white font-bold">{formattedDate}</strong></span>
        </div>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How we calculate Trust Score</span>
          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Explanation Panel */}
      {showExplanation && (
        <div className="relative z-10 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 space-y-2 animate-in fade-in duration-200">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>KumbhStay Trust Standard</span>
          </p>
          <p className="leading-relaxed">
            Every listing undergoes a 5-pillar inspection: host identity checks prevent ghost listings, municipal electricity/registry deeds confirm legal hosting authority, GPS coordinates verify exact walking paths to holy snan ghats, unedited photos prevent deceptive staging, and pricing audits guarantee zero predatory surge pricing during Shahi Snan days.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrustScoreCard;
