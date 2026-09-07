import api from './api';

export const authService = {
  // Register a new user (Pilgrim or Owner)
  async register(userData) {
    const data = await api.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('carenest_token', data.token);
      localStorage.setItem('carenest_user', JSON.stringify(data.user));
      localStorage.setItem('kumbhstay_token', data.token);
      localStorage.setItem('kumbhstay_user', JSON.stringify(data.user));
    }
    return data;
  },

  // Login existing user
  async login(credentials) {
    const data = await api.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('carenest_token', data.token);
      localStorage.setItem('carenest_user', JSON.stringify(data.user));
      localStorage.setItem('kumbhstay_token', data.token);
      localStorage.setItem('kumbhstay_user', JSON.stringify(data.user));
    }
    return data;
  },

  // Get current logged in user profile
  async getMe() {
    return await api.get('/auth/me');
  },

  // Health check
  async checkHealth() {
    return await api.get('/health');
  },

  // Logout
  logout() {
    localStorage.removeItem('carenest_token');
    localStorage.removeItem('carenest_user');
    localStorage.removeItem('kumbhstay_token');
    localStorage.removeItem('kumbhstay_user');
  },

  // Get stored user info from local storage
  getStoredUser() {
    try {
      const user = localStorage.getItem('carenest_user') || localStorage.getItem('kumbhstay_user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  // Get stored JWT token
  getToken() {
    return localStorage.getItem('carenest_token') || localStorage.getItem('kumbhstay_token');
  },
};

export default authService;
