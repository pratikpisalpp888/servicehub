// Initialize Stripe only if secret key is provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// Mock payment processing for development
const processMockPayment = async (amount, currency = 'usd') => {
  // In a real implementation, this would connect to a payment processor
  // For development, we'll simulate a successful payment
  return {
    success: true,
    transactionId: `mock_txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    amount,
    currency
  };
};

// Create a Stripe PaymentIntent
const createPaymentIntent = async (amount, currency = 'usd') => {
  // If Stripe is not configured, fall back to mock payment
  if (!stripe) {
    return processMockPayment(amount, currency);
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        integration_check: 'accept_a_payment'
      }
    });
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Capture a Stripe PaymentIntent
const capturePayment = async (paymentIntentId) => {
  // If Stripe is not configured, return success (mock behavior)
  if (!stripe) {
    return {
      success: true,
      transactionId: paymentIntentId,
      status: 'succeeded'
    };
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    
    return {
      success: true,
      transactionId: paymentIntent.id,
      status: paymentIntent.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  processMockPayment,
  createPaymentIntent,
  capturePayment
};