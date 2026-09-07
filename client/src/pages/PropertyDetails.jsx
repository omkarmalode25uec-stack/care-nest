import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Phone, 
  Clock, 
  Flame, 
  ArrowLeft, 
  Wifi, 
  Wind, 
  Droplet, 
  Car, 
  Bath, 
  Utensils, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  Heart, 
  Compass, 
  Flag,
  MessageSquare,
  Building,
  Info,
  Check,
  X,
  CreditCard,
  ExternalLink,
  Lock,
  Shield
} from 'lucide-react';
import propertyService from '../services/propertyService';
import adminService from '../services/adminService';
import { createBooking } from '../services/bookingService';
import paymentService from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import PropertyMap from '../components/PropertyMap';
import TrustScoreCard from '../components/TrustScoreCard';


export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Date helper functions
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getNextDayString = (dateString) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-').map(Number);
    const nextDate = new Date(y, m - 1, d + 1);
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayString = getTodayString();

  // Booking state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [testModalOrder, setTestModalOrder] = useState(null);

  const handleCheckInChange = (newVal) => {
    setCheckIn(newVal);
    if (!newVal) return;
    const nextDay = getNextDayString(newVal);
    if (!checkOut || checkOut <= newVal) {
      setCheckOut(nextDay);
    }
  };

  const handleCheckOutChange = (newVal) => {
    if (checkIn && newVal <= checkIn) {
      setCheckOut(getNextDayString(checkIn));
    } else {
      setCheckOut(newVal);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.name && !guestName) setGuestName(user.name);
      if (user.phone && !guestPhone) setGuestPhone(user.phone);
    }
  }, [user]);

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [reportReason, setReportReason] = useState('Wrong price');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await propertyService.getPropertyById(id);
        if (res.success && res.property) {
          setProperty(res.property);
        } else {
          setError('Property details not found.');
        }
      } catch (err) {
        console.error('[PropertyDetails] Error fetching property:', err.message);
        setError('Could not load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!isAuthenticated) {
      alert('Please log in or create an account to request a booking.');
      navigate('/login', { state: { from: `/stays/${id}` } });
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingError('Please select valid check-in and check-out dates.');
      return;
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (inDate >= outDate) {
      setBookingError('Check-out date must be strictly after check-in date.');
      return;
    }

    setBookingLoading(true);
    try {
      // 1. Create Pending Booking in MongoDB
      const payload = {
        propertyId: property._id,
        checkIn,
        checkOut,
        guests: parseInt(guestCount, 10) || 1,
        guestName: guestName.trim() || user?.name || 'Pilgrim Guest',
        guestPhone: guestPhone.trim() || user?.phone || '9999999999',
        guestEmail: user?.email || '',
      };

      const bookingRes = await createBooking(payload);
      const bookingId = bookingRes?._id || bookingRes?.booking?._id;

      if (!bookingId) {
        throw new Error('Failed to record booking request.');
      }

      // 2. Generate Razorpay Test Order from backend
      const orderRes = await paymentService.createOrder(bookingId);
      if (!orderRes || !orderRes.order) {
        throw new Error('Failed to create Razorpay test order.');
      }

      // 3. Dynamically load Razorpay SDK
      const scriptReady = await paymentService.loadRazorpayScript();

      if (scriptReady && window.Razorpay && !orderRes.order.isMock) {
        const options = {
          key: orderRes.order.keyId || 'rzp_test_kumbhstaydemo',
          amount: orderRes.order.amount,
          currency: orderRes.order.currency || 'INR',
          name: 'KumbhStay Pilgrim Stays',
          description: `Booking reservation for ${property.title}`,
          order_id: orderRes.order.id,
          prefill: {
            name: guestName.trim() || user?.name || 'Pilgrim Guest',
            email: user?.email || '',
            contact: guestPhone.trim() || user?.phone || '9999999999',
          },
          theme: {
            color: '#ea580c',
          },
          modal: {
            ondismiss: async () => {
              await paymentService.recordFailure(bookingId, 'Payment cancelled by user');
              setBookingError('Payment checkout was dismissed. You can complete payment anytime from My Bookings.');
              setBookingLoading(false);
            },
          },
          handler: async (response) => {
            setPaymentProcessing(true);
            try {
              const verifyRes = await paymentService.verifyPayment({
                bookingId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                navigate(`/bookings/${bookingId}/confirmation`, {
                  state: { paymentSuccess: true, paymentId: response.razorpay_payment_id },
                });
              } else {
                setBookingError('Payment cryptographic verification failed. Please check My Bookings.');
              }
            } catch (vErr) {
              setBookingError('Payment verification error: ' + (vErr.message || 'Signature mismatch'));
            } finally {
              setPaymentProcessing(false);
              setBookingLoading(false);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', async (failedRes) => {
          await paymentService.recordFailure(bookingId, failedRes.error?.description || 'Payment failed');
          setBookingError(`Payment declined: ${failedRes.error?.description || 'Gateway declined transaction'}`);
          setBookingLoading(false);
        });
        rzp.open();
      } else {
        // Test Simulation Modal (Zero external dependency fallback for local/offline testing)
        setTestModalOrder({
          bookingId,
          orderId: orderRes.order.id,
          amount: orderRes.order.amount / 100,
          currency: orderRes.order.currency || 'INR',
          propertyTitle: property.title,
        });
        setBookingLoading(false);
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || err.message || 'Failed to process booking request.');
      setBookingLoading(false);
    }
  };

  const handleSimulatedPayment = async (isSuccess = true) => {
    if (!testModalOrder) return;
    setPaymentProcessing(true);
    try {
      if (isSuccess) {
        const testPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const testSignature = `sig_test_${Date.now()}_verified`;

        const verifyRes = await paymentService.verifyPayment({
          bookingId: testModalOrder.bookingId,
          razorpayOrderId: testModalOrder.orderId,
          razorpayPaymentId: testPaymentId,
          razorpaySignature: testSignature,
        });

        if (verifyRes.success) {
          const bId = testModalOrder.bookingId;
          setTestModalOrder(null);
          navigate(`/bookings/${bId}/confirmation`, {
            state: { paymentSuccess: true, paymentId: testPaymentId },
          });
        }
      } else {
        await paymentService.recordFailure(testModalOrder.bookingId, 'Simulated payment failure / cancellation');
        setBookingError('Simulated payment declined. Booking marked as payment_failed in My Bookings.');
        setTestModalOrder(null);
      }
    } catch (err) {
      setBookingError('Simulation error: ' + (err.message || 'Could not verify payment'));
    } finally {
      setPaymentProcessing(false);
    }
  };


  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reporterName.trim() || !reporterContact.trim() || !reportDetails.trim()) {
      alert('Please fill out your name, contact information, and report details.');
      return;
    }

    setReportSubmitting(true);
    try {
      await adminService.submitReport({
        propertyId: property._id,
        reporterName: reporterName.trim(),
        reporterContact: reporterContact.trim(),
        reason: reportReason,
        details: reportDetails.trim(),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSubmitted(false);
        setReporterName('');
        setReporterContact('');
        setReportDetails('');
      }, 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setReportSubmitting(false);
    }
  };

  const renderAmenity = (amenity) => {
    switch (amenity) {
      case 'wifi':
        return (
          <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Wifi className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">High-Speed Wi-Fi</p>
              <p className="text-[10px] text-slate-500">Free in-room connectivity</p>
            </div>
          </div>
        );
      case 'ac':
        return (
          <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Wind className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Air Conditioning</p>
              <p className="text-[10px] text-slate-500">Climate controlled room</p>
            </div>
          </div>
        );
      case 'water':
        return (
          <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Droplet className="w-5 h-5 text-cyan-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">RO Drinking Water</p>
              <p className="text-[10px] text-slate-500">24/7 Filtered pure water</p>
            </div>
          </div>
        );
      case 'hotWater24h':
        return (
          <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Flame className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">24-hour Hot Water</p>
              <p className="text-[10px] text-slate-500">Geyser active for early snan</p>
            </div>
          </div>
        );
      case 'parking':
        return (
          <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Car className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Vehicle Parking</p>
              <p className="text-[10px] text-slate-500">Secure on-premise parking</p>
            </div>
          </div>
        );
      case 'attachedBathroom':
        return (
          <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Bath className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Attached Bathroom</p>
              <p className="text-[10px] text-slate-500">Private hygienic washroom</p>
            </div>
          </div>
        );
      case 'pureVegFood':
        return (
          <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Utensils className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Sattvic Pure Veg</p>
              <p className="text-[10px] text-slate-500">No onion/garlic options</p>
            </div>
          </div>
        );
      case 'powerBackup':
        return (
          <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <Zap className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">24/7 Power Backup</p>
              <p className="text-[10px] text-slate-500">Inverter & generator</p>
            </div>
          </div>
        );
      default:
        return (
          <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800 capitalize">{amenity}</p>
              <p className="text-[10px] text-slate-500">Available facility</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Loading stay details & trust audits...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Stay Not Found</h2>
        <p className="text-sm text-slate-600">{error || 'Unable to locate property records.'}</p>
        <Link
          to="/stays"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Stays</span>
        </Link>
      </div>
    );
  }

  const galleryImages = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/stays"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stays Search</span>
        </Link>

        {property.isDemo && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Info className="w-3.5 h-3.5 text-amber-700" />
            Demo listing (Sample Data)
          </span>
        )}
      </div>

      {/* 2. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 text-white capitalize">
              {property.propertyType}
            </span>
            {property.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Kumbh Verified Property
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900">
              🛡️ Trust Score: {property.trustScore || 95}/100
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <span>{property.address}, {property.city}, {property.state}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-700 font-bold">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              <span>{property.googleRating || 4.5}</span>
              <span className="text-slate-500 font-normal">({property.googleReviewCount || 100}+ Google Reviews)</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report incorrect info</span>
          </button>
        </div>
      </div>

      {/* 3. Image Gallery */}
      <div className="space-y-3">
        {/* Main large image */}
        <div className="relative h-[320px] sm:h-[460px] rounded-3xl overflow-hidden bg-slate-200 border border-slate-200 shadow-md">
          <img
            src={galleryImages[activeImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute bottom-4 right-4 bg-slate-950/80 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs">
            Photo {activeImageIndex + 1} of {galleryImages.length}
          </div>
        </div>

        {/* Thumbnails strip */}
        {galleryImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-orange-600 shadow-md scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Main Body: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column (2 Cols): Trust Card, Details, Map, Amenities, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* A. 5-Pillar Explainable Trust Score Card */}
          <TrustScoreCard
            trustScore={property.trustScore || 90}
            ownerVerified={property.ownerVerified}
            propertyVerified={property.propertyVerified}
            locationVerified={property.locationVerified}
            photoVerified={property.photoVerified}
            lastVerifiedAt={property.lastVerifiedAt}
          />

          {/* B. Description & Yatri House Rules */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About This Stay</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

            {/* Occupant Suitability */}
            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Occupant Suitability
              </span>
              <div className="flex flex-wrap gap-2">
                {property.occupantPreferences && property.occupantPreferences.map((pref, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-800 capitalize"
                  >
                    ✓ {pref === 'sadhus_pilgrims' ? 'Sadhus / Kalpvasi' : pref === 'seniorCitizen' ? 'Senior Citizen Friendly' : pref}
                  </span>
                ))}
              </div>
            </div>

            {/* Rules */}
            {property.rules && property.rules.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  Pilgrim Stay Guidelines & House Rules
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {property.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* C. Reusable Interactive Map with 4-Landmark Proximity */}
          <PropertyMap
            latitude={property.latitude || property.location?.coordinates?.[1] || 25.4358}
            longitude={property.longitude || property.location?.coordinates?.[0] || 81.8463}
            location={property.location}
            pricePerNight={property.pricePerNight}
            title={property.title}
            address={property.address}
            googleMapsUrl={property.googleMapsUrl}
            locationIntelligence={property.locationIntelligence}
          />

          {/* D. Amenities Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Facilities & Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities && property.amenities.map((a) => renderAmenity(a))}
            </div>
          </div>

          {/* E. Google Reviews & Feedback Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Google Reviews & Feedback</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Google Places
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mt-1">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                  <span>⭐ {property.googleRating || 4.4} / 5</span>
                  <span className="text-slate-500 font-normal">
                    ({property.googleReviewCount || 127} reviews)
                  </span>
                </div>
              </div>

              <a
                href={property.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${property.latitude || 25.4358},${property.longitude || 81.8463}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View on Google Maps</span>
              </a>
            </div>

            {/* Integration Notice Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">
                  {property.googleReviewsData?.isConfigured
                    ? 'Reviews shown from Google Places'
                    : 'Google review integration not configured (Simulated prototype reviews)'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {property.googleReviewsData?.disclaimer ||
                    'Prototype review data provided for demonstration purposes. Real reviews will stream when Google Places API key is configured.'}
                </p>
              </div>
            </div>

            {/* Reviews Cards List */}
            <div className="space-y-3">
              {(property.googleReviewsData?.reviews || property.googleReviews || []).map((rev, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs">
                        {rev.author?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{rev.author}</p>
                        <span className="text-[10px] text-slate-400">{rev.date || 'Recent stay'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (rev.rating || 5) ? 'text-amber-500 fill-amber-500' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Sticky Booking & Transparent Pricing Card */}
        <div className="lg:col-span-1 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg space-y-6">
            {/* Price Transparency Breakdown */}
            <div className="space-y-3 border-b border-slate-100 pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Transparent Tariff Breakdown
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Base Nightly Tariff:</span>
                  <span className="font-bold text-slate-900">₹{property.pricePerNight}</span>
                </div>

                {property.additionalCharges && property.additionalCharges.length > 0 ? (
                  property.additionalCharges.map((ch, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-600">
                      <span>• {ch.name}:</span>
                      <span className="font-semibold text-slate-800">₹{ch.amount}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Additional charges:</span>
                    <span className="text-emerald-700 font-bold">₹0 (No hidden fees)</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Total Estimated Price:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{property.pricingBreakdown?.totalEstimatedPrice || property.pricePerNight}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-normal">/ night (Taxes included)</span>
                  </div>
                </div>
              </div>

              {/* Price Last Updated */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-dashed border-slate-200">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Price last updated:</span>
                </span>
                <span className="font-semibold text-slate-600">
                  {new Date(property.updatedAt || property.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    min={todayString}
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:outline-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    min={checkIn ? getNextDayString(checkIn) : todayString}
                    value={checkOut}
                    onChange={(e) => handleCheckOutChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Total Yatris / Guests
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="1">1 Pilgrim</option>
                  <option value="2">2 Pilgrims</option>
                  <option value="3">3 Pilgrims</option>
                  <option value="4">4+ Pilgrims (Family)</option>
                  <option value="8">8+ Pilgrims (Group / Satsang)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Pilgrim name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile number"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Nights & Price Summary if dates selected */}
              {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1">
                  {(() => {
                    const diffDays = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
                    const rate = property.pricePerNight || 0;
                    const total = diffDays * rate;
                    return (
                      <div className="flex justify-between items-center font-bold text-amber-950">
                        <span>{diffDays} Night{diffDays > 1 ? 's' : ''} × ₹{rate.toLocaleString('en-IN')}:</span>
                        <span className="text-sm font-black text-amber-900">₹{total.toLocaleString('en-IN')} Total</span>
                      </div>
                    );
                  })()}
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading || paymentProcessing}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
              >
                {bookingLoading || paymentProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{paymentProcessing ? 'Verifying Payment...' : 'Opening Razorpay Test Checkout...'}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Proceed to Pay (Razorpay Test Mode)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Razorpay Test Gateway • Zero real money charged</span>
              </div>
            </form>

            {/* Direct Contact & Report Trigger */}
            <div className="pt-4 border-t border-slate-100 text-center space-y-3">
              <div>
                <span className="text-[11px] text-slate-500 block">Host Assistance Contact</span>
                {(() => {
                  const phone = property?.contactPhone || property?.phone || property?.contactNumber || (typeof property?.owner === 'object' ? property?.owner?.phone : null) || (typeof property?.contact === 'object' ? (property?.contact?.phone || property?.contact?.number) : null);
                  if (phone) {
                    return (
                      <a
                        href={`tel:${phone}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-orange-600 transition-colors mt-0.5"
                      >
                        <Phone className="w-4 h-4 text-orange-600" />
                        <span>{phone}</span>
                      </a>
                    );
                  }
                  return (
                    <p className="text-xs text-slate-500 mt-1">
                      Contact information is not available for this property.
                    </p>
                  );
                })()}
              </div>

              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report incorrect information</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-900 text-base">Report Listing Information</h3>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">Report Submitted</p>
                <p>Our quality verification team will audit this property within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone / Email
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91..."
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Reason for Report
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-orange-500"
                  >
                    <option value="Wrong price">Wrong price or tariff inflation</option>
                    <option value="Wrong location">Wrong location or misleading GPS</option>
                    <option value="Incorrect amenities">Incorrect / unavailable amenities</option>
                    <option value="Misleading photos">Misleading photos</option>
                    <option value="Property unavailable">Property unavailable or fake listing</option>
                    <option value="Safety concern">Safety / hygiene concern</option>
                    <option value="Other">Other discrepancy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe what is inaccurate or why this stay requires audit..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-orange-500"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Razorpay Test Mode Simulator Modal */}
      {testModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 sm:p-7 rounded-3xl shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Razorpay Test Gateway</span>
                  <h3 className="font-bold text-slate-900 text-base">Test Mode Payment Simulator</h3>
                </div>
              </div>
              <button
                onClick={() => handleSimulatedPayment(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Accommodation:</span>
                <span className="font-semibold text-slate-900 line-clamp-1">{testModalOrder.propertyTitle}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Order ID:</span>
                <span className="font-mono text-slate-700 text-[11px]">{testModalOrder.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Mode:</span>
                <span className="font-bold text-amber-700">Test Simulation (Paise: {testModalOrder.amount * 100})</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
                <span>Amount to Pay:</span>
                <span className="text-xl font-extrabold text-orange-600">₹{testModalOrder.amount}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                This is a prototype sandbox test payment. Select <strong>Complete Test Payment</strong> to trigger backend HMAC signature verification, or <strong>Simulate Decline</strong> to test error recovery.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={paymentProcessing}
                onClick={() => handleSimulatedPayment(true)}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                {paymentProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying Cryptographic Signature...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Test Payment (Simulate Success)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={paymentProcessing}
                onClick={() => handleSimulatedPayment(false)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Simulate Decline / Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
