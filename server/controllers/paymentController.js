import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import razorpayService from '../services/razorpayService.js';

/**
 * @desc    Get public Razorpay configuration (Public Key only - Never secret)
 * @route   GET /api/payment/config
 * @access  Public
 */
export const getPaymentConfig = async (req, res) => {
  try {
    const keyId = razorpayService.getPublicKeyId();
    res.status(200).json({
      success: true,
      keyId,
      currency: 'INR',
      testMode: true,
      gateway: 'Razorpay Test Mode',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment configuration',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a Razorpay Test Order for an existing booking
 * @route   POST /api/payment/create-order
 * @access  Private (Pilgrim/Owner/Admin)
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid booking ID.',
      });
    }

    const booking = await Booking.findById(bookingId).populate('property', 'title address city pricePerNight');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found.',
      });
    }

    // Ensure the booking belongs to the authenticated user
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to initialize payment for this booking.',
      });
    }

    if (booking.status === 'paid' || booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid and confirmed.',
        booking,
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot process payment for a cancelled booking.',
      });
    }

    // Create test order in paise
    const order = await razorpayService.createOrder({
      amountInINR: booking.totalAmount,
      receipt: `bkg_${booking._id.toString().slice(-8)}`,
      notes: {
        bookingId: booking._id.toString(),
        propertyTitle: booking.property?.title || 'KumbhStay Accommodation',
        guestName: booking.guestName,
        guestPhone: booking.guestPhone,
      },
    });

    // Update booking with pending payment state and Razorpay Order ID
    booking.razorpayOrderId = order.id;
    booking.status = 'pending_payment';
    booking.paymentStatus = 'pending';
    booking.paymentAmount = booking.totalAmount;
    booking.paymentCurrency = 'INR';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Razorpay test order generated successfully',
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: booking._id,
        keyId: razorpayService.getPublicKeyId(),
        isMock: order.isMock,
      },
      bookingSummary: {
        id: booking._id,
        propertyTitle: booking.property?.title,
        totalAmount: booking.totalAmount,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail || req.user.email,
        guestPhone: booking.guestPhone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay test order',
      error: error.message,
    });
  }
};

/**
 * @desc    Cryptographically verify payment signature & update booking to 'paid'
 * @route   POST /api/payment/verify
 * @access  Private (Pilgrim/Owner/Admin)
 */
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!bookingId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification parameters (bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature).',
      });
    }

    const booking = await Booking.findById(bookingId).populate(
      'property',
      'title address city state propertyType contactPhone images pricePerNight googleMapsUrl owner location'
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found for payment verification.',
      });
    }

    // Verify cryptographic HMAC SHA-256 signature
    const isValidSignature = razorpayService.verifySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValidSignature) {
      // Mark as payment failed
      booking.status = 'payment_failed';
      booking.paymentStatus = 'failed';
      await booking.save();

      return res.status(400).json({
        success: false,
        message: 'Cryptographic signature verification failed! Payment could not be validated.',
      });
    }

    // Payment signature is valid -> Update booking to 'paid'
    booking.status = 'paid';
    booking.paymentStatus = 'paid';
    booking.razorpayOrderId = razorpayOrderId;
    booking.razorpayPaymentId = razorpayPaymentId;
    booking.razorpaySignature = razorpaySignature;
    booking.paymentAmount = booking.totalAmount;
    booking.paymentCurrency = 'INR';
    booking.paidAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Booking confirmed via Razorpay Test Mode.',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error occurred during payment verification',
      error: error.message,
    });
  }
};

/**
 * @desc    Record payment failure or user checkout dismissal
 * @route   POST /api/payment/failure
 * @access  Private (Pilgrim/Owner/Admin)
 */
export const recordPaymentFailure = async (req, res) => {
  try {
    const { bookingId, reason = 'Payment cancelled or dismissed by user' } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid booking ID.',
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Only update if not already paid
    if (booking.status !== 'paid' && booking.paymentStatus !== 'paid') {
      booking.status = 'payment_failed';
      booking.paymentStatus = 'failed';
      booking.cancellationReason = reason;
      await booking.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded.',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to record payment failure',
      error: error.message,
    });
  }
};
