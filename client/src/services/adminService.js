import api from './api';

export const adminService = {
  // Get overview metrics
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get properties list for admin
  getProperties: async (params = {}) => {
    const response = await api.get('/admin/properties', { params });
    return response.data;
  },

  // Get deep property audit info
  getPropertyForAudit: async (id) => {
    const response = await api.get(`/admin/properties/${id}`);
    return response.data;
  },

  // Verify property and issue trust score
  verifyProperty: async (id, auditData) => {
    const response = await api.post(`/admin/properties/${id}/verify`, auditData);
    return response.data;
  },

  // Reject property listing
  rejectProperty: async (id, { reason, adminNotes }) => {
    const response = await api.post(`/admin/properties/${id}/reject`, { reason, adminNotes });
    return response.data;
  },

  // Request changes from owner
  requestChanges: async (id, { notes }) => {
    const response = await api.post(`/admin/properties/${id}/request-changes`, { notes });
    return response.data;
  },

  // Suspend property listing
  suspendProperty: async (id, { reason, adminNotes }) => {
    const response = await api.post(`/admin/properties/${id}/suspend`, { reason, adminNotes });
    return response.data;
  },

  // Get pilgrim reports
  getReports: async (params = {}) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  // Update report resolution status
  updateReport: async (id, data) => {
    const response = await api.put(`/admin/reports/${id}`, data);
    return response.data;
  },

  // Get registered property owners
  getOwners: async () => {
    const response = await api.get('/admin/owners');
    return response.data;
  },

  // Public/Pilgrim submission of report
  submitReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },
};

export default adminService;
