import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Home,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { getMyBookings, updateBookingStatus } from '../services/bookingService';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) {
      return;
    }
    try {
      setCancellingId(id);
      await updateBookingStatus(id, 'cancelled', 'Cancelled by pilgrim');
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (status === 'paid' || paymentStatus === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Paid & Confirmed
        </span>
      );
    }
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'pending_payment':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Payment Pending
          </span>
        );
      case 'payment_failed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" /> Payment Failed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending Confirmation
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Kumbh Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Track your accommodation requests and connect with verified hosts.</p>
          </div>
          <Link
            to="/stays"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-2xl transition shadow-md shadow-amber-600/20"
          >
            <Home className="w-4 h-4" /> Discover More Stays
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-600 border-t-transparent"></div>
            <p className="text-sm text-gray-500 font-medium">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No bookings yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              You haven't requested any Nashik Kumbh accommodation yet. Browse trusted stays near Ramkund and Godavari Ghats.
            </p>
            <Link
              to="/stays"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition shadow-lg shadow-amber-600/20"
            >
              Explore Verified Stays <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-4">
            {bookings.map((b) => {
              const prop = b.property || {};
              const checkIn = new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              const checkOut = new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              
              const hostPhone = prop.contactPhone || prop.owner?.phone || '919876543210';
              const cleanHostPhone = hostPhone.replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                `Namaste! Regarding my Care Nest booking #${b._id} for ${prop.title || 'Stay'}:\nDates: ${checkIn} to ${checkOut}.\nPlease assist with check-in instructions.`
              );
              const waUrl = `https://wa.me/${cleanHostPhone.startsWith('91') ? cleanHostPhone : '91' + cleanHostPhone}?text=${waText}`;

              return (
                <div 
                  key={b._id} 
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(b.status, b.paymentStatus)}
                      <span className="text-xs font-mono text-gray-400">ID: #{b._id}</span>
                      <span className="text-xs text-gray-400">• Booked on {new Date(b.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{prop.title || 'Accommodation'}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {prop.address ? `${prop.address}, ` : ''}{prop.city || 'Nashik'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{checkIn} → {checkOut} ({b.totalNights} night{b.totalNights > 1 ? 's' : ''})</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{b.guests} Guest{b.guests > 1 ? 's' : ''}</span>
                      </div>
                      <div className="font-bold text-gray-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 text-amber-900">
                        ₹{b.totalAmount?.toLocaleString('en-IN')} Total
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap md:flex-col items-center sm:items-end gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <Link
                      to={`/bookings/${b._id}/confirmation`}
                      className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl transition border border-amber-200 flex items-center gap-1.5"
                    >
                      <span>View Receipt</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Host</span>
                    </a>

                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        disabled={cancellingId === b._id}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition"
                      >
                        {cancellingId === b._id ? 'Cancelling...' : 'Cancel Request'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
