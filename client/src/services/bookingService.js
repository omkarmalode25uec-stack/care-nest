import api from './api';

// Create booking request
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response?.booking || response?.data?.booking || response?.data || response;
};

// Get logged-in user's bookings
export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response?.bookings || response?.data?.bookings || response?.data || response || [];
};

// Get host's incoming property booking requests
export const getOwnerBookings = async () => {
  const response = await api.get('/owner/bookings');
  return response?.bookings || response?.data?.bookings || response?.data || response || [];
};

// Get single booking by ID
export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response?.booking || response?.data?.booking || response?.data || response;
};

// Update booking status (confirm, cancel, complete)
export const updateBookingStatus = async (id, status, reason = '') => {
  const response = await api.patch(`/bookings/${id}/status`, { status, cancellationReason: reason });
  return response?.booking || response?.data?.booking || response?.data || response;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
};

export default bookingService;

