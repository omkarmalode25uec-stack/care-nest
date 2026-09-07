import api from './api';

export const assistantService = {
  /**
   * Conversational Chatbot Assistant
   * @param {Object} payload { message, currentPropertyId, history }
   */
  chat: async ({ message, currentPropertyId = null, history = [] }) => {
    const response = await api.post('/assistant/chat', {
      message,
      currentPropertyId,
      history,
    });
    return response?.data || response;
  },

  /**
   * Search properties using natural query
   */
  search: async (query) => {
    const response = await api.post('/assistant/search', { query });
    return response?.data || response;
  },

  /**
   * Get recommended properties
   */
  getRecommended: async (params = {}) => {
    const response = await api.get('/properties/recommended', { params });
    return response?.properties || response?.data?.properties || response?.data || response || [];
  },
};

export const chatAssistant = assistantService.chat;
export const searchAssistant = assistantService.search;
export const getRecommended = assistantService.getRecommended;

export default assistantService;
