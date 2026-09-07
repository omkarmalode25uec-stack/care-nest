import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

/**
 * @desc    Create a new stay booking request
 * @route   POST /api/bookings
 * @access  Private (Pilgrim/Owner/Admin)
 */
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkIn,
      checkOut,
      guests = 1,
      guestName,
      guestPhone,
      guestEmail,
      specialRequests = '',
    } = req.body;

    // 1. Basic validation
    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, check-in date, and check-out date.',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date format.',
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after check-in date (minimum 1 night stay).',
      });
    }

    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Number of guests must be at least 1.',
      });
    }

    // 2. Validate property existence & verification status
    const property = await Property.findById(propertyId).populate('owner', 'name phone email');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    if (!property.isActive || property.verificationStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'This property is not currently active or verified for public bookings.',
      });
    }

    // 3. Check for obvious confirmed booking date overlaps
    const existingOverlap = await Booking.findOne({
      property: propertyId,
      status: 'confirmed',
      $or: [
        { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
        { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } },
      ],
    });

    if (existingOverlap) {
      return res.status(400).json({
        success: false,
        message: 'The requested dates are already booked for this accommodation. Please choose alternate dates.',
      });
    }

    // 4. Calculate total amount
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const nightlyRate = property.pricePerNight;
    
    // Include additional charges if any
    const additionalTotal = (property.additionalCharges || []).reduce((acc, c) => acc + (c.amount || 0), 0);
    const totalAmount = (nightlyRate * totalNights) + additionalTotal;

    const booking = await Booking.create({
      user: req.user._id,
      property: propertyId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount,
      nightlyRate,
      totalNights,
      totalAmount,
      guestName: guestName ? guestName.trim() : req.user.name,
      guestPhone: guestPhone ? guestPhone.trim() : req.user.phone,
      guestEmail: guestEmail ? guestEmail.trim() : req.user.email,
      specialRequests: specialRequests ? specialRequests.trim() : '',
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id).populate(
      'property',
      'title address city state propertyType contactPhone images pricePerNight googleMapsUrl owner'
    );

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully! You can contact the host directly via WhatsApp or Phone.',
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create booking request',
      error: error.message,
    });
  }
};

/**
 * @desc    Get logged-in pilgrim's booking history
 * @route   GET /api/bookings/my
 * @access  Private
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title address city propertyType contactPhone images pricePerNight googleMapsUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch personal bookings',
      error: error.message,
    });
  }
};

/**
 * @desc    Get host's incoming property booking requests
 * @route   GET /api/owner/bookings
 * @access  Private (Owner/Admin)
 */
export const getOwnerBookings = async (req, res) => {
  try {
    // Find all properties owned by this host
    const properties = await Property.find({ owner: req.user._id }).select('_id');
    const propertyIds = properties.map((p) => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'title address city propertyType contactPhone pricePerNight')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch owner booking requests',
      error: error.message,
    });
  }
};

/**
 * @desc    Get booking details by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Access check: User must be booking creator, property owner, or admin
    const isCreator = booking.user._id.toString() === req.user._id.toString();
    const isOwner = booking.property?.owner?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking receipt.',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: error.message,
    });
  }
};

/**
 * @desc    Update booking status (Confirm, Cancel, Complete)
 * @route   PATCH /api/bookings/:id/status
 * @access  Private
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason = '' } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status.',
      });
    }

    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const isCreator = booking.user.toString() === req.user._id.toString();
    const isOwner = booking.property?.owner?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Pilgrims can only cancel their own bookings
    if (isCreator && !isOwner && !isAdmin) {
      if (status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Pilgrims are only permitted to cancel pending bookings.',
        });
      }
      booking.status = 'cancelled';
      booking.cancelledBy = 'pilgrim';
      booking.cancellationReason = cancellationReason || 'Cancelled by guest';
    } else if (isOwner || isAdmin) {
      booking.status = status;
      if (status === 'cancelled') {
        booking.cancelledBy = isOwner ? 'owner' : 'admin';
        booking.cancellationReason = cancellationReason || 'Cancelled by host/admin';
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking.',
      });
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking status updated to '${status}' successfully.`,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message,
    });
  }
};
