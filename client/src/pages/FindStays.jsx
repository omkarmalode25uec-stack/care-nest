import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Filter, 
  Search, 
  X, 
  RotateCcw, 
  MapPin, 
  Sparkles, 
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Map,
  LayoutGrid
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import StaysMapView from '../components/StaysMapView';
import SearchBar from '../components/SearchBar';
import RecommendedStays from '../components/RecommendedStays';
import { PropertyCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useTranslation } from '../context/LanguageContext';
import propertyService from '../services/propertyService';

export const FindStays = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();


  // Filter States
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [propertyTypes, setPropertyTypes] = useState(
    searchParams.get('type') ? [searchParams.get('type')] : []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');
  const [gender, setGender] = useState(searchParams.get('gender') || 'all');
  const [occupancy, setOccupancy] = useState(searchParams.get('occupancy') || searchParams.get('stayType') || 'all');
  const [occupantPrefs, setOccupantPrefs] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [ownerVerifiedOnly, setOwnerVerifiedOnly] = useState(false);
  const [locationVerifiedOnly, setLocationVerifiedOnly] = useState(false);

  // UI & Data States
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  // Sync URL search params
  useEffect(() => {
    const loc = searchParams.get('location');
    const type = searchParams.get('type');
    const gen = searchParams.get('gender');
    const occ = searchParams.get('occupancy') || searchParams.get('stayType');
    if (loc) setLocationQuery(loc);
    if (type && !propertyTypes.includes(type)) setPropertyTypes([type]);
    if (gen) setGender(gen);
    if (occ) setOccupancy(occ);
  }, [searchParams]);

  // Fetch properties from backend API
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        locationScope: 'nashik',
        location: locationQuery || undefined,
        propertyType: propertyTypes.length > 0 ? propertyTypes.join(',') : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort: sortBy,
        gender: gender !== 'all' ? gender : undefined,
        occupancy: occupancy !== 'all' ? occupancy : undefined,
        amenities: amenities.length > 0 ? amenities.join(',') : undefined,
        occupantPreference: occupantPrefs.length > 0 ? occupantPrefs.join(',') : undefined,
        verified: verifiedOnly ? 'true' : undefined,
        ownerVerified: ownerVerifiedOnly ? 'true' : undefined,
        locationVerified: locationVerifiedOnly ? 'true' : undefined,
      };

      const res = await propertyService.getProperties(params);
      if (res.success) {
        setProperties(res.properties || []);
      }
    } catch (err) {
      console.error('[FindStays] Error fetching properties:', err.message);
      setError('Could not load stays. Please ensure backend server is active.');
    } finally {
      setLoading(false);
    }
  }, [
    locationQuery,
    propertyTypes,
    minPrice,
    maxPrice,
    sortBy,
    gender,
    occupancy,
    amenities,
    occupantPrefs,
    verifiedOnly,
    ownerVerifiedOnly,
    locationVerifiedOnly,
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Toggle helpers
  const togglePropertyType = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleOccupantPref = (pref) => {
    setOccupantPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const clearAllFilters = () => {
    setLocationQuery('');
    setPropertyTypes([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('recommended');
    setGender('all');
    setOccupancy('all');
    setOccupantPrefs([]);
    setAmenities([]);
    setVerifiedOnly(false);
    setOwnerVerifiedOnly(false);
    setLocationVerifiedOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    locationQuery ||
    propertyTypes.length > 0 ||
    minPrice ||
    maxPrice ||
    sortBy !== 'recommended' ||
    gender !== 'all' ||
    occupancy !== 'all' ||
    occupantPrefs.length > 0 ||
    amenities.length > 0 ||
    verifiedOnly ||
    ownerVerifiedOnly ||
    locationVerifiedOnly;

  // Filter UI Component
  const renderFilterPanel = () => (
    <div className="space-y-6">
      {/* Active Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-orange-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* 1. SORT BY */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:border-orange-500 focus:outline-none cursor-pointer"
        >
          <option value="recommended">Recommended (Highest Trust)</option>
          <option value="trust_desc">Trust Score: High to Low</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Rating: High to Low</option>
          <option value="distance_asc">Distance: Near to Far</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* 2. GENDER SUITABILITY */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Gender Suitability
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'male', label: 'Male' },
            { id: 'female', label: 'Female' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setGender(item.id)}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                gender === item.id
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. STAY TYPE / OCCUPANCY */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Stay Type / Occupancy
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'family', label: 'Family' },
            { id: 'single', label: 'Single' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOccupancy(item.id)}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                occupancy === item.id
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. PROPERTY TYPE */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Property Type
        </label>
        <div className="space-y-2">
          {[
            { id: 'hotel', label: 'Hotel' },
            { id: 'hostel', label: 'Hostel / Dormitory' },
            { id: 'pg', label: 'PG (Paying Guest)' },
            { id: 'homestay', label: 'Homestay' },
            { id: 'ashram', label: 'Ashram / Dharamshala' },
            { id: 'tent', label: 'Luxury Tented Colony' },
          ].map((type) => (
            <label
              key={type.id}
              className="flex items-center gap-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={propertyTypes.includes(type.id)}
                onChange={() => togglePropertyType(type.id)}
                className="w-4 h-4 rounded accent-orange-600"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. PRICE RANGE */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Price Range (₹ per night)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block mb-1">Min (₹)</span>
            <input
              type="number"
              placeholder="e.g. 500"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block mb-1">Max (₹)</span>
            <input
              type="number"
              placeholder="e.g. 3000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. OCCUPANT PREFERENCE */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Occupant Preference
        </label>
        <div className="space-y-2">
          {[
            { id: 'family', label: 'Family' },
            { id: 'female', label: 'Female Only' },
            { id: 'bachelor', label: 'Bachelor / Solo Yatri' },
            { id: 'children', label: 'Children Friendly' },
            { id: 'seniorCitizen', label: 'Senior Citizen Friendly' },
            { id: 'sadhus_pilgrims', label: 'Sadhus / Kalpvasi' },
          ].map((pref) => (
            <label
              key={pref.id}
              className="flex items-center gap-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={occupantPrefs.includes(pref.id)}
                onChange={() => toggleOccupantPref(pref.id)}
                className="w-4 h-4 rounded accent-orange-600"
              />
              <span>{pref.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. AMENITIES */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Amenities
        </label>
        <div className="space-y-2">
          {[
            { id: 'wifi', label: 'Wi-Fi' },
            { id: 'ac', label: 'Air Conditioning (AC)' },
            { id: 'water', label: 'RO Clean Water' },
            { id: 'hotWater24h', label: '24-hour Hot Water' },
            { id: 'parking', label: 'Vehicle Parking' },
            { id: 'attachedBathroom', label: 'Attached Bathroom' },
            { id: 'pureVegFood', label: 'Sattvic Pure Veg Food' },
            { id: 'powerBackup', label: '24/7 Power Backup' },
          ].map((amenity) => (
            <label
              key={amenity.id}
              className="flex items-center gap-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={amenities.includes(amenity.id)}
                onChange={() => toggleAmenity(amenity.id)}
                className="w-4 h-4 rounded accent-orange-600"
              />
              <span>{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 6. VERIFICATION FILTERS */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Verification Level
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-xs font-semibold text-emerald-800 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-600"
            />
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kumbh Verified Only</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={ownerVerifiedOnly}
              onChange={(e) => setOwnerVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded accent-orange-600"
            />
            <span>Owner Identity Verified</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={locationVerifiedOnly}
              onChange={(e) => setLocationVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded accent-orange-600"
            />
            <span>Exact Location Verified</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
          <span>{t('kumbh_verified', 'Verified Pilgrimage Accommodations')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('discovery_title', 'Find a Stay You Can Trust')}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          {t('discovery_subtitle', 'Search verified stays near sacred Snan Ghats with transparent per-night tariffs, physical photo verification, and real pilgrim reviews.')}
        </p>
      </div>

      {/* 2. Search Bar */}
      <SearchBar
        initialValues={{
          location: locationQuery || 'Nashik (Ramkund / Godavari)',
        }}
      />

      {/* 3. Recommended Stays Strip */}
      <RecommendedStays city={locationQuery} limit={3} />

      {/* Mobile Bar: Filter + View Switcher */}
      <div className="flex lg:hidden items-center justify-between gap-3 pt-2">
        <p className="text-xs font-semibold text-slate-600">
          Showing <span className="text-slate-900 font-bold">{properties.length}</span> verified stays
        </p>
        <div className="flex items-center gap-2">
          {/* View Toggle Mobile */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="List View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-xs hover:border-orange-300"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            )}
          </button>
        </div>
      </div>

      {/* 4. Main Content: Sidebar + Grid / Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filter Panel */}
        <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs sticky top-24">
          {renderFilterPanel()}
        </div>

        {/* Property Grid & Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Summary Bar (Desktop) */}
          <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-4">
              <div>
                Showing <span className="font-bold text-slate-900">{properties.length}</span> verified Nashik accommodations
              </div>
              {hasActiveFilters && (
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  <span className="text-slate-400">Filters applied</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Reset all
                  </button>
                </div>
              )}
            </div>

            {/* Desktop View Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-xl"></div>
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error Alert */}
          {error && !loading && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && properties.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                No stays match your selected filters.
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try changing or clearing a filter to see more verified Nashik stays.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}

          {/* Content: Map View or Grid View */}
          {!loading && properties.length > 0 && (
            viewMode === 'map' ? (
              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">
                <StaysMapView properties={properties} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Mobile Filter Modal / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1">
              {renderFilterPanel()}
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindStays;
