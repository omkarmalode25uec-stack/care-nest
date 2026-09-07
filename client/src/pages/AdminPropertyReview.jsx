import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Building2,
  MapPin,
  FileText,
  User,
  Phone,
  Mail,
  ExternalLink,
  Flame,
  Calendar,
  Sparkles,
  Info,
  Check,
  X,
  AlertTriangle,
  Award,
  Clock,
  Eye
} from 'lucide-react';
import adminService from '../services/adminService';

export const AdminPropertyReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [property, setProperty] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [reports, setReports] = useState([]);

  // 6-Point Audit Checklist State
  const [checklist, setChecklist] = useState({
    ownerVerified: true,
    propertyDocumentVerified: true,
    locationVerified: true,
    photoVerified: true,
    pricingVerified: true,
    amenitiesVerified: true,
  });

  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Modals for Reject and Request Changes
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changesNotes, setChangesNotes] = useState('');

  useEffect(() => {
    fetchAuditDetails();
  }, [id]);

  const fetchAuditDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getPropertyForAudit(id);
      if (res.success) {
        setProperty(res.data.property);
        setVerifications(res.data.verifications || []);
        setReports(res.data.reports || []);

        // Pre-populate checklist from existing property state if available
        if (res.data.property.verificationStatus === 'verified') {
          setChecklist({
            ownerVerified: res.data.property.ownerVerified ?? true,
            propertyDocumentVerified: res.data.property.propertyVerified ?? true,
            locationVerified: res.data.property.locationVerified ?? true,
            photoVerified: res.data.property.photoVerified ?? true,
            pricingVerified: true,
            amenitiesVerified: true,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching audit data:', err);
      setError(err.response?.data?.message || 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  // Calculate live explainable Trust Score
  const calculateLiveScore = () => {
    let score = 0;
    if (checklist.ownerVerified) score += 25;
    if (checklist.propertyDocumentVerified) score += 25;
    if (checklist.locationVerified) score += 20;
    if (checklist.photoVerified) score += 15;
    if (checklist.pricingVerified) score += 10;
    if (checklist.amenitiesVerified) score += 5;
    return Math.min(100, score);
  };

  const liveTrustScore = calculateLiveScore();

  const handleCheckboxToggle = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 1. Approve & Issue Kumbh Verified Badge
  const handleApprove = async () => {
    if (!window.confirm(`Issue Kumbh Verified Badge with Trust Score of ${liveTrustScore}/100?`)) {
      return;
    }

    setSubmitting(true);
    try {
      await adminService.verifyProperty(id, {
        ...checklist,
        adminNotes,
      });
      alert('Listing successfully verified and published to Care Nest search!');
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify property');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Reject Listing
  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert('Please provide a mandatory reason for rejection.');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.rejectProperty(id, {
        reason: rejectReason,
        adminNotes,
      });
      alert('Listing rejected.');
      setShowRejectModal(false);
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject listing');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Request Changes
  const handleRequestChanges = async (e) => {
    e.preventDefault();
    if (!changesNotes.trim()) {
      alert('Please provide revision notes for the owner.');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.requestChanges(id, {
        notes: changesNotes,
      });
      alert('Reverted to draft. Owner notified of requested changes.');
      setShowChangesModal(false);
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request changes');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Suspend Listing
  const handleSuspend = async () => {
    if (!window.confirm('Suspend this listing immediately and revoke its verified badge?')) {
      return;
    }

    setSubmitting(true);
    try {
      await adminService.suspendProperty(id, {
        reason: 'Suspended by admin review',
        adminNotes,
      });
      alert('Property suspended.');
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to suspend property');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-700">Loading full listing inspection data...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Unable to load property</h2>
          <p className="text-sm text-slate-600">{error || 'Property not found'}</p>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-semibold text-sm rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Breadcrumb & Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Admin Verification Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Current Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                property.verificationStatus === 'verified'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : property.verificationStatus === 'pending'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                  : property.verificationStatus === 'suspended'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {property.verificationStatus}
            </span>
          </div>
        </div>

        {/* Audit Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Property Full Inspection Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-md uppercase">
                    {property.propertyType}
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 mt-2">{property.title}</h1>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>{property.address}, {property.city}, {property.state}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900">₹{property.pricePerNight}</p>
                  <span className="text-xs text-slate-400">per night</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                <p className="font-semibold text-slate-700">Proximity to Kumbh Mela:</p>
                <p className="text-slate-600 font-medium">{property.distanceFromKumbh}</p>
                {property.distancePoints && property.distancePoints.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {property.distancePoints.map((pt, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-500">
                        <span>• {pt.pointName}</span>
                        <span className="font-semibold text-slate-700">{pt.distance}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                  {property.description}
                </p>
              </div>

              {/* Amenities & Rules */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">Amenities Provided</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {property.amenities?.map((am, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">Occupant Preferences</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {property.occupantPreferences?.map((pref, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded font-medium">
                        • {pref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Gallery Inspection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Exterior & Room Photos ({property.images?.length || 0})</h3>
                <span className="text-xs text-slate-500">Inspect for authentic signage & room condition</span>
              </div>

              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 block"
                    >
                      <img
                        src={img}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No photos uploaded.</p>
              )}
            </div>

            {/* Uploaded Documents Inspection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Legal & Verification Documents</h3>
                <span className="text-xs text-slate-500">Electricity bill, municipal registry, NOC</span>
              </div>

              {property.documents && property.documents.length > 0 ? (
                <div className="space-y-2.5">
                  {property.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{doc.title || doc.fileName}</p>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                            Type: {doc.docType}
                          </span>
                        </div>
                      </div>

                      {doc.fileUrl ? (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Doc</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Uploaded ({doc.fileName})</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                  <p className="font-semibold">⚠️ No supporting documents attached.</p>
                  <p className="text-[11px] mt-0.5">Owner self-submitted without municipal/ownership documents.</p>
                </div>
              )}
            </div>

            {/* Host / Owner Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Host / Property Owner Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
                <div className="space-y-1">
                  <span className="text-slate-500 block">Host Name</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    {property.owner?.name || 'Pandit Rajesh Trivedi'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 block">Phone Number</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    {property.contactPhone || property.owner?.phone || '+91 98390 12345'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 block">Email Address</span>
                  <p className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {property.owner?.email || 'owner@carenest.com'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 block">Identity Status</span>
                  <p className="font-bold text-emerald-700">
                    {property.owner?.isVerified ? '✓ Identity Verified' : 'Pending Direct Audit'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 6-Point Trust Verification Matrix (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Trust Score Gauge Card */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Explainable Trust Engine</span>
                  <h3 className="text-lg font-extrabold text-white mt-0.5">Computed Trust Score</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-950">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              </div>

              {/* Big Score Gauge */}
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-amber-400 tracking-tight">{liveTrustScore}</span>
                    <span className="text-sm font-semibold text-slate-400">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {liveTrustScore >= 85
                      ? '🌟 Care Nest Platinum Trust Grade'
                      : liveTrustScore >= 70
                      ? '🛡️ Verified Standard Grade'
                      : '⚠️ Insufficient for Verified Badge'}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      liveTrustScore >= 70 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {liveTrustScore >= 70 ? 'Eligible ✓' : 'Ineligible'}
                  </span>
                </div>
              </div>

              {/* Breakdown Matrix */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span>1. Owner Identity Verification:</span>
                  <span className="font-mono font-bold text-amber-300">{checklist.ownerVerified ? '25' : '0'} / 25 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>2. Legal / NOC Document Proof:</span>
                  <span className="font-mono font-bold text-amber-300">{checklist.propertyDocumentVerified ? '25' : '0'} / 25 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>3. Ghat / Ramkund Proximity & GPS Accuracy:</span>
                  <span className="font-mono font-bold text-amber-300">{checklist.locationVerified ? '20' : '0'} / 20 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>4. Authentic Exterior & Room Photos:</span>
                  <span className="font-mono font-bold text-amber-300">{checklist.photoVerified ? '15' : '15'} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>5. Tariff Transparency & Sattvic Amenities:</span>
                  <span className="font-mono font-bold text-amber-300">{(checklist.pricingVerified ? 10 : 0) + (checklist.amenitiesVerified ? 5 : 0)} / 15 pts</span>
                </div>
              </div>
            </div>

            {/* 6-Point Interactive Checklist */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Admin 6-Point Audit Checklist</h3>
                <span className="text-[11px] text-slate-500 font-medium">Toggle items after verification</span>
              </div>

              <div className="space-y-3">
                {/* 1. Owner Identity */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.ownerVerified}
                    onChange={() => handleCheckboxToggle('ownerVerified')}
                    className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500 rounded border-slate-300 cursor-pointer"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">1. Owner Identity Verified (25 pts)</p>
                    <p className="text-slate-500">Government ID / Aadhaar / Host direct phone interview confirmed.</p>
                  </div>
                </label>

                {/* 2. Property Documents */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.propertyDocumentVerified}
                    onChange={() => handleCheckboxToggle('propertyDocumentVerified')}
                    className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500 rounded border-slate-300 cursor-pointer"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">2. Ownership / NOC Document Verified (25 pts)</p>
                    <p className="text-slate-500">Municipal tax receipt, power bill or authorized tenancy agreement verified.</p>
                  </div>
                </label>

                {/* 3. Location */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.locationVerified}
                    onChange={() => handleCheckboxToggle('locationVerified')}
                    className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500 rounded border-slate-300 cursor-pointer"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">3. Location & Ghat Proximity Verified (20 pts)</p>
                    <p className="text-slate-500">GPS coordinates and pedestrian walking distance to Ghats confirmed accurate.</p>
                  </div>
                </label>

                {/* 4. Photos */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.photoVerified}
                    onChange={() => handleCheckboxToggle('photoVerified')}
                    className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500 rounded border-slate-300 cursor-pointer"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">4. Authentic Photos Verified (15 pts)</p>
                    <p className="text-slate-500">Photos depict real property without deceptive staging or misleading filters.</p>
                  </div>
                </label>

                {/* 5. Pricing */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.pricingVerified}
                    onChange={() => handleCheckboxToggle('pricingVerified')}
                    className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500 rounded border-slate-300 cursor-pointer"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">5. Tariff Transparency (10 pts)</p>
                    <p className="text-slate-500">Nightly rate contains zero hidden surcharges or predatory surges.</p>
                  </div>
                </label>

                {/* 6. Sattvic Amenities */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.amenitiesVerified}
                    onChange={() => handleCheckboxToggle('amenitiesVerified')}
                    className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500 rounded border-slate-300 cursor-pointer"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">6. Snan Hot Water & Pure Veg Rules (5 pts)</p>
                    <p className="text-slate-500">24h hot water for holy bathing and pure vegetarian guidelines declared.</p>
                  </div>
                </label>
              </div>

              {/* Admin Audit Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Verification Audit Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Record internal remarks on municipal check, call confirmation, or inspector notes..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-orange-500"
                />
              </div>

              {/* Decision Triggers */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleApprove}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Approve & Grant Kumbh Verified Badge</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setShowChangesModal(true)}
                    className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Request Revisions
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setShowRejectModal(true)}
                    className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Reject Listing
                  </button>
                </div>

                {property.verificationStatus === 'verified' && (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSuspend}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Suspend Listing (Hide from Search)
                  </button>
                )}
              </div>
            </div>

            {/* Audit History Timeline */}
            {verifications.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Audit History ({verifications.length})</h3>
                <div className="space-y-3 text-xs">
                  {verifications.map((v, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 uppercase">{v.status}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(v.reviewedAt || v.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        Auditor: <strong>{v.admin?.name || 'Trust Officer'}</strong> • Trust Score: <strong>{v.trustScore}/100</strong>
                      </p>
                      {v.adminNotes && <p className="text-slate-500 italic">"{v.adminNotes}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Reject Property Listing
              </h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mandatory Rejection Reason
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Explain why this listing failed verification (e.g., fraudulent ownership documents, incorrect GPS pin, predatory pricing)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  {submitting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showChangesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-amber-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Request Revisions from Owner
              </h3>
              <button onClick={() => setShowChangesModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestChanges} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Revision Instructions for Host
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe what the host needs to correct (e.g. upload clear electricity bill, clarify attach bathroom vs shared bathroom)..."
                  value={changesNotes}
                  onChange={(e) => setChangesNotes(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangesModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  {submitting ? 'Submitting...' : 'Send Revision Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyReview;
