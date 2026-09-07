import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Wifi, 
  Users, 
  Camera, 
  FileText, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  ExternalLink, 
  AlertCircle, 
  Flame, 
  Wind, 
  Droplet, 
  Car, 
  Bath, 
  Utensils, 
  Zap, 
  ShieldCheck,
  Info,
  Hotel,
  Bed,
  Home,
  FileCheck
} from 'lucide-react';
import ownerService from '../services/ownerService';
import propertyService from '../services/propertyService';

export const AddPropertyWizard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    description: '',
    propertyType: 'hotel',

    // Step 2: Location
    address: '',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    googleMapsUrl: '',
    latitude: 20.0063,
    longitude: 73.7915,
    distanceFromKumbh: '500 m from Ramkund Ghat',

    // Step 3: Pricing
    pricePerNight: '',
    additionalCharges: [], // [{ name, amount }]

    // Step 4: Amenities
    amenities: ['water', 'hotWater24h', 'attachedBathroom'],

    // Step 5: Occupant Preferences
    occupantPreferences: ['family', 'seniorCitizen'],

    // Step 6: Photos
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
    newImageUrl: '',

    // Step 7: Documents
    documents: [
      {
        docType: 'ownership_proof',
        title: 'Property Deed / Lease Agreement',
        fileName: 'ownership_document_scan.pdf',
        status: 'pending',
      },
      {
        docType: 'electricity_bill',
        title: 'Commercial Electricity / Utility Bill',
        fileName: 'electricity_bill_latest.pdf',
        status: 'pending',
      },
    ],
  });

  // Load existing property if editing
  useEffect(() => {
    if (isEditMode) {
      const loadProperty = async () => {
        setLoading(true);
        try {
          const res = await propertyService.getPropertyById(id);
          if (res.success && res.property) {
            const p = res.property;
            setFormData({
              title: p.title || '',
              description: p.description || '',
              propertyType: p.propertyType || 'hotel',
              address: p.address || '',
              city: p.city || 'Prayagraj',
              state: p.state || 'Uttar Pradesh',
              country: p.country || 'India',
              googleMapsUrl: p.googleMapsUrl || '',
              latitude: p.latitude || p.location?.coordinates?.[1] || 25.4358,
              longitude: p.longitude || p.location?.coordinates?.[0] || 81.8463,
              distanceFromKumbh: p.distanceFromKumbh || '',
              pricePerNight: p.pricePerNight || '',
              additionalCharges: p.additionalCharges || [],
              amenities: p.amenities || [],
              occupantPreferences: p.occupantPreferences || [],
              images: p.images && p.images.length > 0 ? p.images : [],
              newImageUrl: '',
              documents: p.documents && p.documents.length > 0 ? p.documents : [],
            });
          }
        } catch (err) {
          setError('Failed to load property for editing.');
        } finally {
          setLoading(false);
        }
      };
      loadProperty();
    }
  }, [id, isEditMode]);

  // Google Maps URL coordinate parser
  const handleGoogleMapsUrlChange = (url) => {
    setFormData((prev) => {
      let lat = prev.latitude;
      let lng = prev.longitude;

      const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        lat = parseFloat(atMatch[1]);
        lng = parseFloat(atMatch[2]);
      } else {
        const qMatch = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (qMatch) {
          lat = parseFloat(qMatch[1]);
          lng = parseFloat(qMatch[2]);
        }
      }

      return {
        ...prev,
        googleMapsUrl: url,
        latitude: lat,
        longitude: lng,
      };
    });
  };

  const openGoogleMaps = () => {
    const url = formData.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${formData.latitude},${formData.longitude}`;
    window.open(url, '_blank');
  };

  // Amenities toggle
  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Occupant Preferences toggle
  const togglePreference = (pref) => {
    setFormData((prev) => ({
      ...prev,
      occupantPreferences: prev.occupantPreferences.includes(pref)
        ? prev.occupantPreferences.filter((p) => p !== pref)
        : [...prev.occupantPreferences, pref],
    }));
  };

  // Additional Charges helpers
  const [newChargeName, setNewChargeName] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState('');

  const addAdditionalCharge = () => {
    if (!newChargeName || !newChargeAmount) return;
    setFormData((prev) => ({
      ...prev,
      additionalCharges: [
        ...prev.additionalCharges,
        { name: newChargeName, amount: Number(newChargeAmount) },
      ],
    }));
    setNewChargeName('');
    setNewChargeAmount('');
  };

  const removeAdditionalCharge = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalCharges: prev.additionalCharges.filter((_, i) => i !== index),
    }));
  };

  // Photos helpers
  const addImage = () => {
    if (!formData.newImageUrl) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, prev.newImageUrl.trim()],
      newImageUrl: '',
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addPresetImage = (url) => {
    if (!formData.images.includes(url)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  // Step Validation
  const validateStep = () => {
    setError(null);
    if (step === 1) {
      if (!formData.title || formData.title.trim() === '') {
        setError('Property name is required.');
        return false;
      }
      if (!formData.description || formData.description.trim() === '') {
        setError('Property description is required.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.address || !formData.city) {
        setError('Address and City are required.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.pricePerNight || Number(formData.pricePerNight) <= 0) {
        setError('Please provide a valid price per night in INR.');
        return false;
      }
    } else if (step === 4) {
      if (formData.amenities.length === 0) {
        setError('Please select at least one amenity facility.');
        return false;
      }
    } else if (step === 5) {
      if (formData.occupantPreferences.length === 0) {
        setError('Please select at least one occupant preference.');
        return false;
      }
    } else if (step === 6) {
      if (formData.images.length === 0) {
        setError('Please provide at least one photo of your stay.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 8));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save / Submit Handler
  const handleFinalSubmit = async (submitForReview) => {
    if (!validateStep()) return;

    setSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      submitNow: submitForReview,
    };

    try {
      if (isEditMode) {
        await ownerService.updateProperty(id, payload);
        if (submitForReview) {
          await ownerService.submitProperty(id);
        }
      } else {
        await ownerService.createProperty(payload);
      }
      navigate('/owner/dashboard');
    } catch (err) {
      console.error('[AddPropertyWizard] Submission error:', err.message);
      setError(err.message || 'Failed to save property. Please review all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepNames = [
    'Basic Info',
    'Location',
    'Pricing',
    'Amenities',
    'Preferences',
    'Photos',
    'Documents',
    'Review',
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/owner/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Owner Dashboard</span>
        </Link>
        <span className="text-xs font-semibold text-slate-500">
          Step {step} of 8: <span className="text-slate-900 font-bold">{stepNames[step - 1]}</span>
        </span>
      </div>

      {/* 2. Step Progress Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {stepNames.map((name, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < step;
            const isCurrent = stepNum === step;

            return (
              <div key={idx} className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => stepNum < step && setStep(stepNum)}
                  disabled={stepNum > step}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isCurrent
                      ? 'bg-orange-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{stepNum}</span>
                  <span className="hidden sm:inline">{name}</span>
                </button>
                {idx < stepNames.length - 1 && (
                  <div className="w-3 h-px bg-slate-200 shrink-0"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. Multi-Step Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-8">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 1: Basic Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide your property name, category, and a clear description for pilgrims.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Property Name / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shree Ram Residency & Pilgrim Niwas"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'hotel', label: 'Hotel', icon: Hotel },
                    { id: 'hostel', label: 'Hostel', icon: Bed },
                    { id: 'pg', label: 'PG Stay', icon: Building2 },
                    { id: 'homestay', label: 'Homestay', icon: Home },
                    { id: 'ashram', label: 'Ashram', icon: Building2 },
                    { id: 'dharamshala', label: 'Dharamshala', icon: Building2 },
                    { id: 'tent', label: 'Luxury Tent', icon: Building2 },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = formData.propertyType === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFormData({ ...formData, propertyType: item.id })}
                        className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-orange-600' : 'text-slate-500'}`} />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description & Pilgrim Facilities <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your accommodation, proximity to sacred Ghats, hot water availability, and assistance offered to yatris..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-orange-500 focus:outline-none"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 2: Location & GPS</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accurate address and coordinates ensure pilgrims can navigate without confusion during mela traffic diversions.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Street Address & Sector / Ghat Landmark <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 14, Daraganj Ghat Marg, Sector 2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-orange-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Nashik">Nashik</option>
                    <option value="Trimbakeshwar">Trimbakeshwar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Google Maps URL (Optional link)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={formData.googleMapsUrl}
                    onChange={(e) => handleGoogleMapsUrlChange(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={openGoogleMaps}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Open in Maps</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 3: Transparent Pricing</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                KumbhStay enforces transparent pricing. Zero surprise surge fees are permitted on peak Snan dates.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-3 text-orange-950 text-xs">
              <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Total price should be transparent.</span>
                <span>The tariff entered here will be binding for pilgrims booking through KumbhStay.</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Standard Nightly Tariff (₹ per room/bed) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-slate-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="850"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Optional Additional Charges */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Optional Additional Charges (e.g. Extra Mattress, Sattvic Thali)
                </span>

                {formData.additionalCharges.map((charge, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{charge.name}</span>
                      <span className="text-slate-500 ml-2 font-medium">₹{charge.amount}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAdditionalCharge(idx)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Charge Name (e.g. Extra Mattress)"
                    value={newChargeName}
                    onChange={(e) => setNewChargeName(e.target.value)}
                    className="flex-2 p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={newChargeAmount}
                    onChange={(e) => setNewChargeAmount(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addAdditionalCharge}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Amenities */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 4: Amenities</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select all verified amenities available for pilgrims at your stay.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
                { id: 'ac', label: 'AC (Air Conditioning)', icon: Wind },
                { id: 'water', label: 'RO Clean Water', icon: Droplet },
                { id: 'hotWater24h', label: '24-hour Hot Water', icon: Flame },
                { id: 'parking', label: 'Vehicle Parking', icon: Car },
                { id: 'attachedBathroom', label: 'Attached Bathroom', icon: Bath },
                { id: 'pureVegFood', label: 'Sattvic Pure Veg Food', icon: Utensils },
                { id: 'powerBackup', label: '24/7 Power Backup', icon: Zap },
              ].map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.id);
                return (
                  <button
                    type="button"
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-orange-600' : 'text-slate-400'}`} />
                    <span className="text-xs leading-snug">{amenity.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Occupant Preferences */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 5: Occupant Preferences</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify who is welcome at your property to assist pilgrims with suitable matching.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'family', label: 'Family Friendly', desc: 'Suitable for family yatris with elders and kids' },
                { id: 'female', label: 'Female Only / Safe for Women', desc: 'Secure environment for female pilgrims traveling solo or in groups' },
                { id: 'bachelor', label: 'Bachelor / Solo Yatris', desc: 'Individual pilgrims and student yatris welcome' },
                { id: 'children', label: 'Children Friendly', desc: 'Safe flooring, warm water, and kid-safe spaces' },
                { id: 'seniorCitizen', label: 'Senior Citizen Friendly', desc: 'Ground floor access, minimal stairs, western toilets' },
                { id: 'sadhus_pilgrims', label: 'Sadhus & Kalpvasi Pilgrims', desc: 'Facilities tailored for month-long Kalpvas and spiritual seekers' },
              ].map((pref) => {
                const isSelected = formData.occupantPreferences.includes(pref.id);
                return (
                  <button
                    type="button"
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-950 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{pref.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{pref.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Property Photos */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 6: Property Photos</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add authentic photos of exterior, rooms, and washroom hygiene.
              </p>
            </div>

            {/* Photo Grid Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 group">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-90 hover:opacity-100 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Cover Photo
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add Image URL Input */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Add Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.newImageUrl}
                  onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs"
                >
                  Add Photo
                </button>
              </div>
            </div>

            {/* Preset Samples Helper */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Quick Gallery Presets (Click to add):</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Room & Bedding', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80' },
                  { label: 'Exterior / Entrance', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
                  { label: 'Ashram Courtyard', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
                  { label: 'Swiss Tent Exterior', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addPresetImage(preset.url)}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-orange-500 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Property Documents */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 7: Property Documents</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload supporting ownership and tax verification documents for admin review.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-950 text-xs">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Document Review Notice</span>
                <span>Ownership and authorization documents will be reviewed by the administrator before issuing the Trust Badge. Personal identity numbers are never published.</span>
              </div>
            </div>

            <div className="space-y-3">
              {formData.documents.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{doc.title}</p>
                      <p className="text-[11px] text-slate-500">{doc.fileName} • Status: <span className="font-semibold text-amber-700 uppercase">{doc.status}</span></p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                    Attached
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: Review Before Submit */}
        {step === 8 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 8: Review Before Submit</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review all details before saving as draft or submitting for physical audit.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block font-semibold">Property Title:</span>
                  <span className="font-bold text-slate-900 text-sm">{formData.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Property Type:</span>
                  <span className="font-bold text-slate-900 capitalize">{formData.propertyType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Nightly Tariff:</span>
                  <span className="font-bold text-slate-900 text-sm">₹{formData.pricePerNight} / night</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Location & City:</span>
                  <span className="font-bold text-slate-900">{formData.address}, {formData.city}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block font-semibold mb-1">Selected Amenities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.amenities.map((a, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 capitalize font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block font-semibold mb-1">Photos Attached:</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {formData.images.map((img, idx) => (
                    <img key={idx} src={img} alt="thumb" className="w-16 h-12 rounded-lg object-cover" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Wizard Footer Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-3">
            {step === 8 ? (
              <>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleFinalSubmit(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleFinalSubmit(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit for Verification</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyWizard;
