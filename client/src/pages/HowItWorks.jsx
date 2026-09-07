import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  UserCheck, 
  Camera, 
  DollarSign, 
  Compass, 
  HeartHandshake, 
  ArrowRight,
  Flame
} from 'lucide-react';

export const HowItWorks = () => {
  const pillars = [
    {
      step: '01',
      title: 'Owner & Host Verification',
      subtitle: 'Legal Title & Identity Audit',
      description: 'We require all property hosts, dharamshala managers, and ashram trustees to verify government identification and property ownership documents before their listing can be published.',
      icon: UserCheck,
      checklist: [
        'Government photo ID verification',
        'Commercial / residential premises validity check',
        'Host contact telephone and grievance address verification'
      ]
    },
    {
      step: '02',
      title: 'Physical Property Inspection',
      subtitle: 'On-Ground Quality & Sanitation Audit',
      description: 'Our ground coordinators physically visit every property. We verify bed counts, washroom hygiene, 24/7 hot water supply, and emergency exits.',
      icon: Camera,
      checklist: [
        'Unfiltered authentic photography',
        '24/7 water and hot water functionality audit',
        'Fire safety and emergency egress check'
      ]
    },
    {
      step: '03',
      title: 'Location & Ghat Proximity Verification',
      subtitle: 'Accurate GeoJSON Coordinates & Pedestrian Paths',
      description: 'Misleading distances are common during mass festivals. KumbhStay physically walks and records real pedestrian routes to Snan Ghats, Pontoon Bridges, and Shuttle Points.',
      icon: MapPin,
      checklist: [
        'Precise GeoJSON [longitude, latitude] coordinates',
        'Measured walking time to major Snan Ghats',
        'Sector gate and nearest shuttle stand mapping'
      ]
    },
    {
      step: '04',
      title: 'Transparent Pricing Guarantee',
      subtitle: 'Zero Last-Minute Price Gouging',
      description: 'Listed hosts sign the KumbhStay Fair Tariff Charter. The price you book on KumbhStay is final, protecting yatris from unexpected cash demands on arrival.',
      icon: DollarSign,
      checklist: [
        'Zero surprise surcharge on peak Shahi Snan days',
        'Direct digital booking confirmation',
        '24/7 Pilgrim Grievance escalation channel'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
          <ShieldCheck className="w-4 h-4 text-orange-600" />
          The KumbhStay Trust Standard
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How KumbhStay Protects Every Pilgrim
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Our 4-pillar verification protocol ensures transparent pricing, real photos, accurate Ghat proximity, and physical safety for all Kumbh Mela yatris.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="space-y-8">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
            >
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-orange-600 font-mono">
                    {pillar.step}
                  </span>
                  <div className="h-4 w-px bg-slate-300"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    {pillar.subtitle}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {pillar.checklist.map((item, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-48 h-36 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Icon className="w-16 h-16" />
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white text-center max-w-4xl mx-auto shadow-xl space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto">
          <Flame className="w-6 h-6 text-amber-200 fill-amber-200" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Experience a Stress-Free Kumbh Pilgrimage
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
          Book with complete peace of mind knowing your accommodation has been physically inspected by our on-ground team.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to="/stays"
            className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <span>Explore Verified Stays</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/for-owners"
            className="px-6 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Property Owner Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
