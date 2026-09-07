import api from './api';

export const ownerService = {
  // Get owner dashboard stats and property list
  async getOwnerProperties() {
    return await api.get('/owner/properties');
  },

  // Create new property
  async createProperty(propertyData) {
    return await api.post('/properties', propertyData);
  },

  // Update property
  async updateProperty(id, propertyData) {
    return await api.put(`/properties/${id}`, propertyData);
  },

  // Delete property
  async deleteProperty(id) {
    return await api.delete(`/properties/${id}`);
  },

  // Submit property for verification
  async submitProperty(id) {
    return await api.post(`/properties/${id}/submit`);
  },

  // Resubmit property for verification after changes requested
  async resubmitProperty(id, notes = '') {
    return await api.post(`/owner/properties/${id}/resubmit`, { resubmissionNotes: notes });
  },

  // Submit owner verification documents
  async submitDocuments(documents) {
    return await api.post('/owner/verification/documents', { documents });
  },
};

export default ownerService;
