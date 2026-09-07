import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Flag,
  Users,
  Building2,
  Search,
  Filter,
  Eye,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  X,
  FileText,
  Copy,
  HelpCircle,
  FileQuestion
} from 'lucide-react';
import adminService from '../services/adminService';
import useAuth from '../hooks/useAuth';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'verified', 'changes_requested', 'rejected', 'all', 'reports', 'owners'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listings state
  const [properties, setProperties] = useState([]);
  const [reports, setReports] = useState([]);
  const [owners, setOwners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'

  // Report resolution modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportActionNotes, setReportActionNotes] = useState('');
  const [reportActionTaken, setReportActionTaken] = useState('information_corrected');
  const [resolvingReport, setResolvingReport] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab, sortBy]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const statsRes = await adminService.getStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }

      // Fetch tab-specific data
      if (['pending', 'verified', 'changes_requested', 'rejected', 'all'].includes(activeTab)) {
        const statusParam = activeTab === 'all' ? 'all' : activeTab;
        const res = await adminService.getProperties({ status: statusParam, sort: sortBy });
        if (res.success) setProperties(res.data || []);
      } else if (activeTab === 'reports') {
        const res = await adminService.getReports();
        if (res.success) setReports(res.data || []);
      } else if (activeTab === 'owners') {
        const res = await adminService.getOwners();
        if (res.success) setOwners(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (status) => {
    if (!selectedReport) return;
    setResolvingReport(true);
    try {
      await adminService.updateReport(selectedReport._id, {
        status,
        adminNotes: reportActionNotes,
        actionTaken: reportActionTaken,
      });
      setSelectedReport(null);
      setReportActionNotes('');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report status');
    } finally {
      setResolvingReport(false);
    }
  };

  const handleSuspendProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to suspend this property? It will be immediately hidden from pilgrim searches.')) {
      return;
    }
    try {
      await adminService.suspendProperty(propertyId, {
        reason: 'Suspended by admin during routine quality inspection',
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to suspend property');
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (!p) return false;
    const q = searchQuery.toLowerCase().trim();
    const title = (p.title || '').toLowerCase();
    const city = (p.city || '').toLowerCase();
    const address = (p.address || '').toLowerCase();
    const ownerName = (p.owner?.name || '').toLowerCase();
    const ownerEmail = (p.owner?.email || '').toLowerCase();
    const id = (p._id || '').toLowerCase();

    const matchesSearch =
      q === '' ||
      title.includes(q) ||
      city.includes(q) ||
      address.includes(q) ||
      ownerName.includes(q) ||
      ownerEmail.includes(q) ||
      id.includes(q);

    const matchesType = typeFilter === 'all' || p.propertyType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-200">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Verification Console
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase tracking-wider">
                  Admin Central
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Care Nest verification engine • Strict Nashik platform scope verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total Stays */}
            <div
              onClick={() => setActiveTab('all')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Total Stays
                </span>
                <Building2 className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-2xl font-black mt-2">{stats.properties.total || 0}</p>
              <p className={`text-[10px] mt-0.5 ${activeTab === 'all' ? 'text-slate-300' : 'text-slate-400'}`}>Nashik scope</p>
            </div>

            {/* Pending Audit */}
            <div
              onClick={() => setActiveTab('pending')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-200'
                  : 'bg-white text-slate-900 border-amber-300 hover:border-amber-400 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'pending' ? 'text-amber-100' : 'text-amber-700'}`}>
                  Pending
                </span>
                <Clock className={`w-4 h-4 ${activeTab === 'pending' ? 'text-amber-100' : 'text-amber-600'}`} />
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <p className="text-2xl font-black">{stats.properties.pending || 0}</p>
                {stats.properties.pending > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    activeTab === 'pending' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    Action
                  </span>
                )}
              </div>
              <p className={`text-[10px] mt-0.5 ${activeTab === 'pending' ? 'text-amber-100' : 'text-slate-400'}`}>
                Awaiting review
              </p>
            </div>

            {/* Verified Listings */}
            <div
              onClick={() => setActiveTab('verified')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'verified'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-200'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'verified' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                  Approved
                </span>
                <ShieldCheck className={`w-4 h-4 ${activeTab === 'verified' ? 'text-emerald-100' : 'text-emerald-600'}`} />
              </div>
              <p className="text-2xl font-black mt-2">{stats.properties.verified || 0}</p>
              <p className={`text-[10px] mt-0.5 ${activeTab === 'verified' ? 'text-emerald-100' : 'text-slate-400'}`}>
                Live with badge
              </p>
            </div>

            {/* Changes Requested */}
            <div
              onClick={() => setActiveTab('changes_requested')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'changes_requested'
                  ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-200'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-blue-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'changes_requested' ? 'text-blue-100' : 'text-blue-700'}`}>
                  Changes Req.
                </span>
                <FileQuestion className={`w-4 h-4 ${activeTab === 'changes_requested' ? 'text-blue-100' : 'text-blue-600'}`} />
              </div>
              <p className="text-2xl font-black mt-2">{stats.properties.changesRequested || 0}</p>
              <p className={`text-[10px] mt-0.5 ${activeTab === 'changes_requested' ? 'text-blue-100' : 'text-slate-400'}`}>
                Sent back to host
              </p>
            </div>

            {/* Rejected / Suspended */}
            <div
              onClick={() => setActiveTab('rejected')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'rejected'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-200'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-rose-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'rejected' ? 'text-rose-100' : 'text-rose-700'}`}>
                  Rejected
                </span>
                <XCircle className={`w-4 h-4 ${activeTab === 'rejected' ? 'text-rose-100' : 'text-rose-600'}`} />
              </div>
              <p className="text-2xl font-black mt-2">{(stats.properties.rejected || 0) + (stats.properties.suspended || 0)}</p>
              <p className={`text-[10px] mt-0.5 ${activeTab === 'rejected' ? 'text-rose-100' : 'text-slate-400'}`}>
                Declined / paused
              </p>
            </div>

            {/* Pilgrim Reports */}
            <div
              onClick={() => setActiveTab('reports')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-200'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-purple-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'reports' ? 'text-purple-100' : 'text-purple-700'}`}>
                  Reports
                </span>
                <Flag className={`w-4 h-4 ${activeTab === 'reports' ? 'text-purple-100' : 'text-purple-600'}`} />
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <p className="text-2xl font-black">{stats.reports?.total || 0}</p>
                {(stats.reports?.pending || 0) > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    activeTab === 'reports' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {stats.reports.pending} open
                  </span>
                )}
              </div>
              <p className={`text-[10px] mt-0.5 ${activeTab === 'reports' ? 'text-purple-100' : 'text-slate-400'}`}>
                Yatri safety alerts
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation & Controls */}
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending</span>
              {stats?.properties.pending > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'pending' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'}`}>
                  {stats.properties.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('verified')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'verified'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved</span>
              {stats?.properties.verified > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'verified' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800'}`}>
                  {stats.properties.verified}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('changes_requested')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'changes_requested'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Changes Requested</span>
              {stats?.properties.changesRequested > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'changes_requested' ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-800'}`}>
                  {stats.properties.changesRequested}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'rejected'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Rejected</span>
              {((stats?.properties.rejected || 0) + (stats?.properties.suspended || 0)) > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'rejected' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-800'}`}>
                  {(stats?.properties.rejected || 0) + (stats?.properties.suspended || 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>All Properties</span>
              {stats?.properties.total > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'all' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-800'}`}>
                  {stats.properties.total}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'reports'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Pilgrim Reports</span>
              {stats?.reports.pending > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'reports' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-800'}`}>
                  {stats.reports.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('owners')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'owners'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Registered Owners</span>
            </button>
          </div>

          {/* Search, Filter, Sort Controls for property tabs */}
          {['pending', 'verified', 'changes_requested', 'rejected', 'all'].includes(activeTab) && (
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter name, owner, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-orange-500 focus:bg-white"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-orange-500 font-medium"
              >
                <option value="all">All Types</option>
                <option value="hotel">Hotel</option>
                <option value="homestay">Homestay</option>
                <option value="ashram">Ashram</option>
                <option value="hostel">Hostel</option>
                <option value="pg">PG</option>
                <option value="dharamshala">Dharamshala</option>
                <option value="tent">Tent</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-orange-500 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab Content Panels */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-600">Loading audit records...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 text-rose-600" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <div>
            {/* Property Tables: Pending / Verified / Changes Requested / Rejected / All */}
            {['pending', 'verified', 'changes_requested', 'rejected', 'all'].includes(activeTab) && (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {activeTab === 'pending' && 'Pending Property Verification Queue'}
                      {activeTab === 'verified' && 'Verified Care Nest Listings (Live)'}
                      {activeTab === 'changes_requested' && 'Properties Awaiting Host Corrections'}
                      {activeTab === 'rejected' && 'Rejected & Suspended Accommodations'}
                      {activeTab === 'all' && 'All Nashik Accommodation Inventory'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeTab === 'pending' && 'Submitted properties waiting for 6-point verification checklist review'}
                      {activeTab === 'verified' && 'Active accommodations visible to pilgrims with trust badge'}
                      {activeTab === 'changes_requested' && 'Host requested to update documents, photos, or pricing'}
                      {activeTab === 'rejected' && 'Failed trust audit or paused due to safety reports'}
                      {activeTab === 'all' && 'Comprehensive registry of all properties in Nashik scope'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full">
                    {filteredProperties.length} Properties
                  </span>
                </div>

                {filteredProperties.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                      {activeTab === 'pending' ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <Search className="w-8 h-8" />}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {activeTab === 'pending' ? 'No pending verification requests' : 'No properties match your filter'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      {activeTab === 'pending'
                        ? 'All submitted Nashik properties have been reviewed.'
                        : 'Try searching with different terms or changing your filter criteria.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3.5 px-5">Property Name</th>
                          <th className="py-3.5 px-4">Property ID</th>
                          <th className="py-3.5 px-4">Owner / Host</th>
                          <th className="py-3.5 px-4">Location</th>
                          <th className="py-3.5 px-4">Submitted</th>
                          <th className="py-3.5 px-4">Owner Status</th>
                          <th className="py-3.5 px-4">Property Status</th>
                          <th className="py-3.5 px-5 text-right">Review Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProperties.map((prop) => {
                          const ownerStatus = prop.owner?.ownerVerificationStatus || (prop.ownerVerified ? 'verified' : 'pending');
                          const propStatus = prop.verificationStatus || 'pending';

                          return (
                            <tr key={prop._id} className="hover:bg-slate-50/80 transition-colors">
                              {/* 1. Property Name & Photo */}
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80'}
                                    alt={prop.title}
                                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 line-clamp-1 text-xs">{prop.title}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded uppercase">
                                        {prop.propertyType}
                                      </span>
                                      <span className="text-[11px] font-bold text-slate-800">
                                        ₹{prop.pricePerNight}<span className="text-slate-400 font-normal">/nt</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Property ID */}
                              <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                                <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-700 font-semibold" title={prop._id}>
                                  {prop._id ? `${prop._id.slice(0, 8)}...` : 'N/A'}
                                </span>
                              </td>

                              {/* 3. Owner Name & Email */}
                              <td className="py-4 px-4">
                                <div className="text-xs">
                                  <p className="font-bold text-slate-900">{prop.owner?.name || 'Self Registered'}</p>
                                  <p className="text-slate-500 text-[11px] line-clamp-1">{prop.owner?.email || 'N/A'}</p>
                                  <p className="text-slate-400 text-[10px]">{prop.contactPhone || prop.owner?.phone || ''}</p>
                                </div>
                              </td>

                              {/* 4. Location */}
                              <td className="py-4 px-4">
                                <div className="text-xs">
                                  <p className="font-semibold text-slate-800">{prop.city || 'Nashik'}, {prop.state || 'Maharashtra'}</p>
                                  <p className="text-slate-500 text-[11px] line-clamp-1">{prop.address || prop.distanceFromKumbh || 'Nashik Area'}</p>
                                </div>
                              </td>

                              {/* 5. Submission Date */}
                              <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                                {prop.createdAt
                                  ? new Date(prop.createdAt).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : 'N/A'}
                              </td>

                              {/* 6. Owner Verification Status */}
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                    ownerStatus === 'verified'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : ownerStatus === 'rejected'
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {ownerStatus === 'verified' && <Check className="w-3 h-3" />}
                                  {ownerStatus}
                                </span>
                              </td>

                              {/* 7. Property Verification Status */}
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                    propStatus === 'verified' || propStatus === 'approved'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : propStatus === 'changes_requested'
                                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                      : propStatus === 'rejected'
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : propStatus === 'suspended'
                                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                      : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                                  }`}
                                >
                                  {propStatus === 'verified' || propStatus === 'approved' ? (
                                    <ShieldCheck className="w-3 h-3" />
                                  ) : propStatus === 'pending' ? (
                                    <Clock className="w-3 h-3" />
                                  ) : null}
                                  {propStatus}
                                </span>
                              </td>

                              {/* 8. Review Button */}
                              <td className="py-4 px-5 text-right whitespace-nowrap">
                                <Link
                                  to={`/admin/properties/${prop._id}`}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  <span>Review & Verify</span>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Pilgrim Reports Queue */}
            {activeTab === 'reports' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Pilgrim Reports & Issue Alerts</h2>
                    <p className="text-xs text-slate-500">Reports filed by yatris regarding inaccurate pricing, incorrect locations, or safety concerns</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                    {reports.length} Reports
                  </span>
                </div>

                {reports.length === 0 ? (
                  <div className="p-16 text-center text-slate-500">
                    <p className="text-xs font-bold">No reports filed yet. All listings operating smoothly.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3.5 px-6">Reported Property</th>
                          <th className="py-3.5 px-4">Reason</th>
                          <th className="py-3.5 px-4">Reporter Details</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Details</th>
                          <th className="py-3.5 px-6 text-right">Resolution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reports.map((report) => (
                          <tr key={report._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-6">
                              <p className="font-bold text-slate-900">{report.property?.title || 'Unknown Property'}</p>
                              <span className="text-[11px] text-slate-500">{report.property?.city}</span>
                            </td>

                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                {report.reason}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-xs">
                              <p className="font-semibold text-slate-800">{report.reporterName}</p>
                              <p className="text-slate-500 text-[11px]">{report.reporterContact}</p>
                            </td>

                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                report.status === 'pending'
                                  ? 'bg-purple-100 text-purple-800 animate-pulse'
                                  : report.status === 'resolved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {report.status}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-xs text-slate-600 max-w-xs line-clamp-2">
                              {report.details}
                            </td>

                            <td className="py-4 px-6 text-right space-x-2">
                              {report.status === 'pending' ? (
                                <button
                                  onClick={() => setSelectedReport(report)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  Take Action
                                </button>
                              ) : (
                                <span className="text-xs text-emerald-700 font-semibold">Resolved ✓</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Registered Owners Directory */}
            {activeTab === 'owners' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Registered Property Hosts & Owners</h2>
                    <p className="text-xs text-slate-500">Direct contact directory of verified and pending accommodation hosts</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full">
                    {owners.length} Owners
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-6">Owner Name</th>
                        <th className="py-3.5 px-4">Contact Details</th>
                        <th className="py-3.5 px-4">Verification</th>
                        <th className="py-3.5 px-4">Total Listed Stays</th>
                        <th className="py-3.5 px-4">Verified Stays</th>
                        <th className="py-3.5 px-6 text-right">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {owners.map((owner) => (
                        <tr key={owner._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                              {owner.name?.charAt(0)}
                            </div>
                            <span>{owner.name}</span>
                          </td>

                          <td className="py-4 px-4 text-xs">
                            <p className="font-medium text-slate-800">{owner.email}</p>
                            <p className="text-slate-500 text-[11px]">{owner.phone}</p>
                          </td>

                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              owner.ownerVerificationStatus === 'verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {owner.ownerVerificationStatus || 'pending'}
                            </span>
                          </td>

                          <td className="py-4 px-4 font-bold text-slate-800">
                            {owner.totalProperties || 0}
                          </td>

                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {owner.verifiedProperties || 0} Verified
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right text-xs text-slate-500">
                            {new Date(owner.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Resolution Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Resolve Pilgrim Report</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <p><span className="font-semibold text-slate-700">Property:</span> {selectedReport.property?.title}</p>
              <p><span className="font-semibold text-slate-700">Reporter:</span> {selectedReport.reporterName} ({selectedReport.reporterContact})</p>
              <p><span className="font-semibold text-slate-700">Issue:</span> <strong className="text-rose-700">{selectedReport.reason}</strong></p>
              <p className="text-slate-600 mt-1 italic">"{selectedReport.details}"</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Action Taken</label>
                <select
                  value={reportActionTaken}
                  onChange={(e) => setReportActionTaken(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-orange-500 font-medium"
                >
                  <option value="information_corrected">Information Verified & Corrected</option>
                  <option value="owner_notified">Host/Owner Notified of Discrepancy</option>
                  <option value="listing_suspended">Property Listing Suspended</option>
                  <option value="dismissed_invalid">Dismissed (Report Invalid)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admin Audit Notes</label>
                <textarea
                  rows="3"
                  placeholder="Record what investigation was conducted..."
                  value={reportActionNotes}
                  onChange={(e) => setReportActionNotes(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-orange-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resolvingReport}
                onClick={() => handleResolveReport('dismissed')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl cursor-pointer"
              >
                Dismiss Report
              </button>
              <button
                type="button"
                disabled={resolvingReport}
                onClick={() => handleResolveReport('resolved')}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
              >
                {resolvingReport ? 'Saving...' : 'Resolve & Close Issue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

