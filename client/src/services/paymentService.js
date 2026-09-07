import api from './api';

/**
 * Payment Service for Care Nest (Razorpay Test Mode Integration)
 */

export const paymentService = {
  // Get public gateway config (Never exposes secret)
  getPaymentConfig: async () => {
    const res = await api.get('/payment/config');
    return res?.data || res;
  },

  // Create Razorpay test order from backend
  createOrder: async (bookingId) => {
    const res = await api.post('/payment/create-order', { bookingId });
    return res?.data || res;
  },

  // Cryptographically verify payment on backend
  verifyPayment: async (payload) => {
    const res = await api.post('/payment/verify', payload);
    return res?.data || res;
  },

  // Record failed or dismissed payment
  recordFailure: async (bookingId, reason) => {
    const res = await api.post('/payment/failure', { bookingId, reason });
    return res?.data || res;
  },

  /**
   * Dynamically loads Razorpay checkout.js script if not already on the page
   */
  loadRazorpayScript: () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true);
      }

      const existingScript = document.getElementById('razorpay-checkout-script');
      if (existingScript) {
        existingScript.onload = () => resolve(true);
        existingScript.onerror = () => resolve(false);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-checkout-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.warn('[Razorpay] Script loading blocked or offline. Test checkout simulator will activate.');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  },
};

export const { getPaymentConfig, createOrder, verifyPayment, recordFailure, loadRazorpayScript } = paymentService;
export default paymentService;
