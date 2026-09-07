import api from './api';

// Get medical assistance points (supports city, type, isEmergency, lat, lng, search)
export const getMedicalPoints = async (params = {}) => {
  const response = await api.get('/medical-points', { params });
  return response?.medicalPoints || response?.data?.medicalPoints || response?.data || response || [];
};

// Get single medical point
export const getMedicalPointById = async (id) => {
  const response = await api.get(`/medical-points/${id}`);
  return response?.medicalPoint || response?.data?.medicalPoint || response?.data || response;
};

export const medicalService = {
  getMedicalPoints,
  getMedicalPointById,
};

export default medicalService;

