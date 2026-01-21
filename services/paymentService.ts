
/**
 * FoTI Payment Service
 * This service acts as the bridge to your Node.js/Python backend 
 * which handles the actual Daraja API (M-Pesa) integrations.
 */

export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  merchantId: string;
  currency: string;
}

export interface PaymentResponse {
  checkoutRequestId: string;
  customerMessage: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}

// In a real app, this would be your backend URL (e.g., https://api.fotipay.com)
const BACKEND_URL = '/api'; 

export const initiateMpesaStkPush = async (request: PaymentRequest): Promise<PaymentResponse> => {
  console.log("Initiating Daraja STK Push for:", request);
  
  // SIMULATION: In reality, your backend would:
  // 1. Get OAuth Token from Daraja
  // 2. Call https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
  // 3. Return the CheckoutRequestID to the frontend
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
  
  return {
    checkoutRequestId: `ws_CO_${Math.random().toString(36).substr(2, 9)}`,
    customerMessage: "Success. Request accepted for processing",
    status: 'PENDING'
  };
};

export const checkTransactionStatus = async (checkoutRequestId: string): Promise<'SUCCESS' | 'PENDING' | 'FAILED'> => {
  // SIMULATION: Frontend polls this while waiting for the Daraja Callback to hit the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real demo, we'd check our backend DB
      // For this UI, we return success after 3 seconds
      resolve('SUCCESS');
    }, 3000);
  });
};
