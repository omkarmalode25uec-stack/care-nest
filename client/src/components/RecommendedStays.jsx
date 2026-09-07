import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, MapPin, Star, ArrowRight, Award } from 'lucide-react';
import { getRecommended } from '../services/assistantService';
import { useTranslation } from '../context/LanguageContext';
import { PropertyCardSkeleton } from './ui/Skeleton';

export default function RecommendedStays({ city, limit = 3 }) {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        setLoading(true);
        const params = {};
        if (city) params.city = city;
        const data = await getRecommended(params);
        setProperties((data || []).slice(0, limit));
      } catch (err) {
        console.warn('[RecommendedStays] Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommended();
  }, [city, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
      </div>
    );
  }

  if (properties.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              {t('recommended_for_you', 'Recommended For You')}
            </h3>
            <p className="text-[11px] text-gray-500">
              Hand-picked verified stays with top trust scores & transparent tariffs.
            </p>
          </div>
        </div>

        <Link
          to="/stays"
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {properties.map((p) => {
          const image = p.images && p.images.length > 0
            ? p.images[0]
            : 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80';

          return (
            <div
              key={p._id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-full shadow-xs">
                      {p.propertyType}
                    </span>
                    {p.recommendationReason && (
                      <span className="text-[10px] font-black bg-amber-400 text-amber-950 px-2 py-1 rounded-full shadow-xs flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{p.recommendationReason}</span>
                      </span>
                    )}
                  </div>

                  {/* Price overlay */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xl font-black">₹{p.pricePerNight}</span>
                    <span className="text-xs text-white/80 font-normal"> / night</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <h4 className="font-bold text-base text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {p.title}
                  </h4>

                  <p className="text-xs text-gray-500 flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {p.address ? `${p.address}, ` : ''}{p.city}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Trust Score: {p.trustScore || 90}/100
                    </span>

                    {p.googleRating && (
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {p.googleRating}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link
                  to={`/stays/${p._id}`}
                  className="w-full py-2.5 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{t('view_details', 'View Stay & Trust Details')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
