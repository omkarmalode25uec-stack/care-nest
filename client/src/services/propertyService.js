import api from './api';

export const propertyService = {
  // Fetch properties with filters
  async getProperties(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        if (Array.isArray(value) && value.length > 0) {
          query.append(key, value.join(','));
        } else if (!Array.isArray(value)) {
          query.append(key, value);
        }
      }
    });

    const queryString = query.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    return await api.get(endpoint);
  },

  // Fetch single property by ID
  async getPropertyById(id) {
    return await api.get(`/properties/${id}`);
  },
};

export default propertyService;
