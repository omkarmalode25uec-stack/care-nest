import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Send, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  UserCheck, 
  Camera, 
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import ownerService from '../services/ownerService';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    draft: 0,
  });
  const [ownerVerification, setOwnerVerification] = useState({
    identity: 'pending',
    propertyDocuments: 'pending',
    faceLiveness: 'not_implemented',
    adminApproval: 'pending',
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ownerService.getOwnerProperties();
      if (res.success) {
        setStats(res.stats || { total: 0, verified: 0, pending: 0, rejected: 0, draft: 0 });
        setOwnerVerification(res.ownerVerification || {});
        setProperties(res.properties || []);
      }
    } catch (err) {
      console.error('[OwnerDashboard] Error fetching owner data:', err.message);
      setError('Could not load owner dashboard. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSubmitForVerification = async (id, title) => {
    try {
      const res = await ownerService.submitProperty(id);
      if (res.success) {
        setActionSuccess(`"${title}" submitted for verification successfully!`);
        fetchDashboardData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit property for verification.');
    }
  };

  const handleDeleteProperty = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await ownerService.deleteProperty(id);
      if (res.success) {
        setActionSuccess(`"${title}" deleted successfully.`);
        fetchDashboardData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete property.');
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Pending Review
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Changes Requested
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Rejected
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. Header with Host Welcome & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
              Host Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">Kumbh Mela 2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Owner Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Welcome back, <span className="font-semibold text-slate-900">{user?.name}</span>. Manage your listings and track on-ground verification status.
          </p>
        </div>

        <Link
          to="/owner/properties/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Action Notification Alerts */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Properties */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Stays</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{stats.total}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Verified */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Verified</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 block">{stats.verified}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">In Review</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-900 mt-1 block">{stats.pending}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Drafts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Drafts</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-700 mt-1 block">{stats.draft}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Owner Verification Audit Widget */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Host Verification Protocol Status
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Transparent review pipeline. All items must pass audit before properties appear on public pilgrim searches.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 self-start sm:self-auto">
            Audit ID: {user?._id ? user._id.slice(-6).toUpperCase() : 'HOST-01'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Identity */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Identity Audit</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                ownerVerification.identity === 'verified'
                  ? 'bg-emerald-900 text-emerald-300'
                  : 'bg-amber-900/80 text-amber-300'
              }`}>
                {ownerVerification.identity}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Host profile and contact check</p>
          </div>

          {/* Property Documents */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Property Docs</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                ownerVerification.propertyDocuments === 'verified'
                  ? 'bg-emerald-900 text-emerald-300'
                  : 'bg-amber-900/80 text-amber-300'
              }`}>
                {ownerVerification.propertyDocuments}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Electricity bill / title proof</p>
          </div>

          {/* Face / Liveness */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Face / Liveness</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-slate-700 text-slate-400">
                Not Implemented
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Planned for future phase</p>
          </div>

          {/* Admin Approval */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Admin Approval</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                ownerVerification.adminApproval === 'approved'
                  ? 'bg-emerald-900 text-emerald-300'
                  : 'bg-amber-900/80 text-amber-300'
              }`}>
                {ownerVerification.adminApproval}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Zonal coordinator clearance</p>
          </div>
        </div>
      </div>

      {/* 4. Property Table & Listing Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Accommodations</h2>
          <span className="text-xs text-slate-500 font-medium">
            {properties.length} listings recorded
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">Loading your accommodation records...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No Properties Listed Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by registering your hotel, hostel, homestay, or ashram for Kumbh Mela verification.
            </p>
            <Link
              to="/owner/properties/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Listing</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 sm:px-6">Property</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Price / Night</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((prop) => {
                    const primaryImg = prop.images && prop.images.length > 0
                      ? prop.images[0]
                      : 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=200&q=80';

                    return (
                      <tr key={prop._id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Property Title & Location */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={primaryImg}
                              alt={prop.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                {prop.title}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                                {prop.city} • {prop.distanceFromKumbh || 'Near Ramkund Ghat'}
                              </p>

                              {/* Revision Comment / Rejection Reason Callout */}
                              {prop.verificationStatus === 'changes_requested' && prop.reviewComment && (
                                <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 font-medium">
                                  <strong>⚠️ Admin Note:</strong> {prop.reviewComment}
                                </div>
                              )}
                              {prop.verificationStatus === 'rejected' && prop.rejectionReason && (
                                <div className="mt-1.5 p-2 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-900 font-medium">
                                  <strong>❌ Rejection Reason:</strong> {prop.rejectionReason}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Property Type */}
                        <td className="py-4 px-4 font-semibold text-slate-700 capitalize">
                          {prop.propertyType}
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 font-bold text-slate-900">
                          ₹{prop.pricePerNight}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {renderStatusBadge(prop.verificationStatus)}
                        </td>

                        {/* Last Updated */}
                        <td className="py-4 px-4 text-slate-500">
                          {new Date(prop.updatedAt || prop.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Details */}
                            <Link
                              to={`/stays/${prop._id}`}
                              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Public Stay Page"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Edit */}
                            <Link
                              to={`/owner/properties/${prop._id}/edit`}
                              className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Edit Property"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            {/* Submit / Resubmit for verification if in draft, rejected, or changes_requested */}
                            {(prop.verificationStatus === 'draft' || prop.verificationStatus === 'rejected' || prop.verificationStatus === 'changes_requested') && (
                              <button
                                onClick={() => handleSubmitForVerification(prop._id, prop.title)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer shadow-xs"
                                title={prop.verificationStatus === 'changes_requested' ? 'Resubmit for Verification' : 'Submit for Verification'}
                              >
                                <Send className="w-3 h-3" />
                                <span>{prop.verificationStatus === 'changes_requested' ? 'Resubmit' : 'Submit'}</span>
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteProperty(prop._id, prop.title)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Property"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
