import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Wifi, 
  Wind, 
  Droplet, 
  Flame, 
  Car, 
  Bath, 
  Utensils, 
  Zap, 
  Check, 
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';

export const PropertyCard = ({ property }) => {
  // Helper for amenity icons
  const renderAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'wifi':
        return <span key={amenity} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"><Wifi className="w-3 h-3 text-orange-600" /> Wi-Fi</span>;
      case 'ac':
        return <span key={amenity} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"><Wind className="w-3 h-3 text-blue-600" /> AC</span>;
      case 'water':
        return <span key={amenity} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"><Droplet className="w-3 h-3 text-cyan-600" /> Water</span>;
      case 'hotWater24h':
        return <span key={amenity} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"><Flame className="w-3 h-3 text-amber-600" /> 24h Hot Water</span>;
      case 'parking':
        return <span key={amenity} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"><Car className="w-3 h-3 text-emerald-600" /> Parking</span>;
      case 'attachedBathroom':
        return <span key={amenity} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"><Bath className="w-3 h-3 text-indigo-600" /> Attached Bath</span>;
      case 'pureVegFood':
        return <span key={amenity} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"><Utensils className="w-3 h-3 text-emerald-600" /> Pure Veg</span>;
      case 'powerBackup':
        return <span key={amenity} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"><Zap className="w-3 h-3 text-amber-500" /> Power Backup</span>;
      default:
        return <span key={amenity} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md capitalize">{amenity}</span>;
    }
  };

  const formatPreferences = (prefs) => {
    if (!prefs || prefs.length === 0) return 'All Yatris';
    return prefs
      .map((p) => {
        switch (p) {
          case 'family': return 'Family';
          case 'female': return 'Female';
          case 'bachelor': return 'Bachelor';
          case 'children': return 'Children';
          case 'seniorCitizen': return 'Senior Citizen';
          case 'sadhus_pilgrims': return 'Sadhus / Pilgrims';
          default: return p;
        }
      })
      .slice(0, 3)
      .join(' • ');
  };

  const primaryImage = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Image & Trust Badges Header */}
        <div className="relative h-52 overflow-hidden bg-slate-100">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Verification Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {property.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700 shadow-md backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Nashik Verified</span>
              </span>
            )}
            {property.dataStatus === 'demo' || property.isDemo ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-amber-300 border border-amber-500/40 backdrop-blur-xs">
                <Info className="w-3 h-3 text-amber-400" />
                Nashik Demo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-xs">
                Nashik Kumbh
              </span>
            )}
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1 shadow-md backdrop-blur-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{property.googleRating || 4.5}</span>
            <span className="text-[10px] text-slate-500 font-normal">
              ({property.googleReviewCount || 50}+)
            </span>
          </div>

          {/* Property Type Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-950/80 text-white shadow-xs capitalize backdrop-blur-xs">
              {property.propertyType}
            </span>
          </div>

          {/* Trust Score Pill */}
          <div className="absolute bottom-3 right-3">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
              Trust Score: {property.trustScore || 90}%
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3.5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
              {property.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {property.address}, {property.city}{property.state ? `, ${property.state}` : ''}
            </p>
          </div>

          {/* Distance from Kumbh Area / Ghat */}
          <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-xs font-semibold text-orange-950 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="truncate">{property.distanceFromKumbh}</span>
          </div>

          {/* Occupant Suitability */}
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Suitable for: </span>
            <span>{formatPreferences(property.occupantPreferences)}</span>
          </div>

          {/* Amenities List */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Amenities:</span>
            <div className="flex flex-wrap gap-1.5">
              {property.amenities && property.amenities.slice(0, 4).map((a) => renderAmenityIcon(a))}
              {property.amenities && property.amenities.length > 4 && (
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  +{property.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* 3-Point Verification Checklist & Last Verified Date */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Verification:
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Verified: {new Date(property.lastVerifiedAt || '2026-08-15').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className={`inline-flex items-center gap-1 ${property.ownerVerified ? 'text-emerald-700' : 'text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Owner
              </span>
              <span className={`inline-flex items-center gap-1 ${property.propertyVerified ? 'text-emerald-700' : 'text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Docs
              </span>
              <span className={`inline-flex items-center gap-1 ${property.locationVerified ? 'text-emerald-700' : 'text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Location
              </span>
              <span className={`inline-flex items-center gap-1 ${property.photoVerified ? 'text-emerald-700' : 'text-slate-400'}`}>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Photos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & View Details Action */}
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">No hidden fees</span>
          <p className="text-xl font-extrabold text-slate-900">
            ₹{property.pricePerNight}
            <span className="text-xs font-normal text-slate-500"> / night</span>
          </p>
        </div>

        <Link
          to={`/stays/${property._id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
