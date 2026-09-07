import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Users, 
  MessageSquare, 
  Phone, 
  ArrowLeft, 
  ShieldCheck, 
  ExternalLink,
  Clock,
  Home,
  CreditCard,
  Lock
} from 'lucide-react';
import { getBookingById } from '../services/bookingService';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBooking() {
      try {
        setLoading(true);
        const data = await getBookingById(id);
        setBooking(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchBooking();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'We could not retrieve this booking.'}</p>
          <Link to="/stays" className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Stays
          </Link>
        </div>
      </div>
    );
  }

  const property = booking.property || {};
  const hostPhone = property.contactPhone || property.owner?.phone || '919876543210';
  const cleanHostPhone = hostPhone.replace(/[^0-9]/g, '');

  const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const isPaid = booking.paymentStatus === 'paid' || booking.status === 'paid';

  // Pre-filled WhatsApp message
  const waText = encodeURIComponent(
    `Namaste! I have booked a stay on KumbhStay.\n\n` +
    `📌 Property: ${property.title || 'Accommodation'}\n` +
    `🔖 Booking ID: #${booking._id}\n` +
    `💳 Payment: ${isPaid ? `PAID via Razorpay Test Mode (Ref: ${booking.razorpayPaymentId || 'Completed'})` : 'Payment Pending'}\n` +
    `📅 Dates: ${checkInDate} to ${checkOutDate} (${booking.totalNights} night${booking.totalNights > 1 ? 's' : ''})\n` +
    `👥 Guests: ${booking.guests}\n` +
    `👤 Name: ${booking.guestName}\n\n` +
    `Please confirm the arrival and check-in instructions. Dhanyawad!`
  );

  const whatsappUrl = `https://wa.me/${cleanHostPhone.startsWith('91') ? cleanHostPhone : '91' + cleanHostPhone}?text=${waText}`;

  // Google Maps link
  const mapAddress = encodeURIComponent(`${property.title || ''}, ${property.address || ''}, ${property.city || ''}`);
  const googleMapsUrl = property.location?.coordinates 
    ? `https://www.google.com/maps/dir/?api=1&destination=${property.location.coordinates[1]},${property.location.coordinates[0]}`
    : `https://www.google.com/maps/search/?api=1&query=${mapAddress}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/20 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-xl shadow-amber-900/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500"></div>
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            {isPaid ? 'Booking Confirmed & Paid!' : 'Booking Request Placed!'}
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-base">
            {isPaid
              ? 'Your test payment was cryptographically verified via Razorpay Test Mode. Your stay reservation is confirmed.'
              : 'Your booking request has been securely recorded on KumbhStay. The property host has been notified.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {isPaid ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Payment Status: <span className="uppercase tracking-wider">PAID (Razorpay Test Mode)</span></span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Status: <span className="uppercase tracking-wider font-bold">{booking.status}</span></span>
              </span>
            )}
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Booking Reference</span>
              <p className="text-lg font-mono font-bold text-gray-900">#{booking._id}</p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Amount</span>
              <p className="text-2xl font-black text-amber-600">₹{booking.totalAmount?.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Razorpay Safe Transaction Details */}
          {isPaid && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">Razorpay Test Transaction Metadata</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Razorpay Payment ID:</span>
                  <span className="font-mono text-emerald-300 font-bold">{booking.razorpayPaymentId || 'pay_test_verified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Razorpay Order ID:</span>
                  <span className="font-mono text-slate-300">{booking.razorpayOrderId || 'order_test_verified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Amount Paid:</span>
                  <span className="text-amber-400 font-bold">₹{booking.paymentAmount || booking.totalAmount} INR</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payment Timestamp:</span>
                  <span className="text-slate-300">
                    {booking.paidAt
                      ? new Date(booking.paidAt).toLocaleString('en-IN')
                      : new Date().toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Property Info */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Home className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{property.title || 'Kumbh Stay Accommodation'}</h3>
                {property.verification?.isKumbhVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                {property.address ? `${property.address}, ` : ''}{property.city || 'Nashik'}
              </p>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Check-In / Check-Out</p>
                <p className="text-sm font-bold text-gray-900">{checkInDate} → {checkOutDate}</p>
                <p className="text-xs text-amber-700 font-semibold">{booking.totalNights} Night{booking.totalNights > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Pilgrim Guests</p>
                <p className="text-sm font-bold text-gray-900">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-600">{booking.guestName} ({booking.guestPhone})</p>
              </div>
            </div>
          </div>

          {/* Actions & WhatsApp Contact */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h4 className="text-sm font-bold text-gray-900">Host Communication & Arrival</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Trigger Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Contact Host on WhatsApp</span>
              </a>

              {/* Google Maps Directions Button */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-2xl hover:border-amber-500 hover:text-amber-600 transition shadow-sm active:scale-[0.98]"
              >
                <MapPin className="w-5 h-5 text-red-500" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Host Phone: <span className="font-bold">{hostPhone}</span>. Clicking WhatsApp opens a pre-drafted message with your booking details ready to send.</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            to="/bookings/my"
            className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
          >
            ← View All My Bookings
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/health"
              className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition border border-teal-200"
            >
              🏥 Kumbh Health Assistance
            </Link>
            <Link
              to="/stays"
              className="text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition"
            >
              Find More Stays
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
