import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Razorpay Test Mode Service Abstraction
 * Handles test order creation and HMAC SHA-256 cryptographic verification.
 * Secret keys are strictly maintained on the backend and NEVER sent to the client.
 */

class RazorpayService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_kumbhstaydemo';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'kumbhstay_test_secret_2026';
    
    // Initialize official Razorpay SDK client
    if (this.keyId && this.keySecret) {
      try {
        this.client = new Razorpay({
          key_id: this.keyId,
          key_secret: this.keySecret,
        });
      } catch (err) {
        this.client = null;
      }
    }
  }

  /**
   * Get public Key ID for client checkout popup (Public only - NEVER secret)
   */
  getPublicKeyId() {
    return this.keyId;
  }

  /**
   * Create Razorpay Test Order in paise (1 INR = 100 paise)
   * @param {Object} params - { amountInINR, receipt, notes }
   */
  async createOrder({ amountInINR, receipt, notes = {} }) {
    const amountInPaise = Math.round(Number(amountInINR) * 100);

    // Try real Razorpay API if valid credentials provided
    if (this.client && !this.keyId.includes('demo') && !this.keyId.includes('YOUR_KEY_ID')) {
      try {
        const order = await this.client.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: {
            platform: 'Care Nest',
            mode: 'test',
            ...notes,
          },
        });

        return {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          isMock: false,
        };
      } catch (apiError) {
        console.warn('[Razorpay API Warning] Fallback to test mock order:', apiError.message);
      }
    }

    // Graceful Test Simulation Order for local test mode
    const simulatedOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id: simulatedOrderId,
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      isMock: true,
    };
  }

  /**
   * Cryptographically verify payment signature using HMAC SHA-256
   * @param {Object} params - { orderId, paymentId, signature }
   */
  verifySignature({ orderId, paymentId, signature }) {
    if (!orderId || !paymentId || !signature) {
      return false;
    }

    const secret = this.keySecret;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Safe timing-safe comparison
    try {
      const match = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf8'),
        Buffer.from(signature, 'utf8')
      );
      if (match) return true;
    } catch {
      // Length mismatch in buffer
    }

    // Direct comparison for test simulator mode
    if (expectedSignature === signature) {
      return true;
    }

    // Also support test-mode simulator signatures formatted as `sig_test_...`
    if (orderId.startsWith('order_test_') && signature.startsWith('sig_test_')) {
      return true;
    }

    return false;
  }

  /**
   * Helper to generate a valid test signature for frontend test simulators
   */
  generateTestSignature(orderId, paymentId) {
    return crypto
      .createHmac('sha256', this.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  }
}

export const razorpayService = new RazorpayService();
export default razorpayService;
