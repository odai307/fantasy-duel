const axios = require('axios');
const env = require('../shared/config/env');
const { makeError } = require('../shared/errors');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

function getPaystackHeaders() {
  if (!env.paystackSecretKey) {
    throw makeError(500, 'Paystack secret key is not configured');
  }
  return {
    Authorization: `Bearer ${env.paystackSecretKey}`,
    'Content-Type': 'application/json',
  };
}

async function initializeTransaction({ email, amountGhs, reference, callbackUrl, metadata = {} }) {
  const amountInPesewas = Math.round(Number(amountGhs) * 100);

  if (isNaN(amountInPesewas) || amountInPesewas <= 0) {
    throw makeError(400, 'Invalid deposit amount');
  }

  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amountInPesewas,
        currency: 'GHS',
        reference,
        callback_url: callbackUrl,
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: 'Platform',
              variable_name: 'platform',
              value: 'FantasyDuel',
            },
          ],
        },
      },
      {
        headers: getPaystackHeaders(),
      }
    );

    if (!response.data?.status) {
      throw makeError(400, response.data?.message || 'Failed to initialize Paystack transaction');
    }

    return {
      authorizationUrl: response.data.data.authorization_url,
      accessCode: response.data.data.access_code,
      reference: response.data.data.reference,
    };
  } catch (error) {
    if (error.response?.data?.message) {
      throw makeError(400, `Paystack Error: ${error.response.data.message}`);
    }
    throw error;
  }
}

async function verifyTransaction(reference) {
  if (!reference) {
    throw makeError(400, 'Transaction reference is required');
  }

  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: getPaystackHeaders(),
      }
    );

    if (!response.data?.status) {
      throw makeError(400, response.data?.message || 'Failed to verify transaction');
    }

    const data = response.data.data;
    return {
      status: data.status, // 'success', 'failed', 'abandoned'
      reference: data.reference,
      amountGhs: Number(data.amount) / 100,
      gatewayResponse: data.gateway_response,
      paidAt: data.paid_at,
      channel: data.channel, // 'mobile_money', 'card', etc.
      customer: data.customer,
    };
  } catch (error) {
    if (error.response?.data?.message) {
      throw makeError(400, `Paystack Verification Error: ${error.response.data.message}`);
    }
    throw error;
  }
}

module.exports = {
  initializeTransaction,
  verifyTransaction,
};
