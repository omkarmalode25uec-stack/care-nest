import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide check-out date'],
    },
    guests: {
      type: Number,
      required: [true, 'Please specify number of guests'],
      min: [1, 'At least 1 guest required'],
      default: 1,
    },
    nightlyRate: {
      type: Number,
      required: true,
    },
    totalNights: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please provide total amount'],
      min: 0,
    },
    guestName: {
      type: String,
      required: [true, 'Please provide primary guest name'],
      trim: true,
    },
    guestPhone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      default: '',
    },
    specialRequests: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'pending_payment', 'paid', 'confirmed', 'payment_failed', 'cancelled', 'completed'],
      default: 'pending_payment',
      index: true,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledBy: {
      type: String,
      enum: ['pilgrim', 'owner', 'admin', null],
      default: null,
    },
    // Safe Razorpay Test Payment Transaction Metadata (Zero sensitive credentials)
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', null],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    paymentCurrency: {
      type: String,
      default: 'INR',
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
