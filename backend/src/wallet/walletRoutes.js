const express = require('express');
const router = express.Router();
const authMiddleware = require('../shared/middleware/authMiddleware');
const walletController = require('./walletController');

// 1. Initialize Paystack Mobile Money / Card Deposit Link
router.post('/deposit/initialize', authMiddleware, walletController.initializeDeposit);

// 2. Verify Deposit Reference & Credit Balance
router.post('/deposit/verify', authMiddleware, walletController.verifyDeposit);

// 3. Request Mobile Money / Bank Withdrawal
router.post('/withdraw', authMiddleware, walletController.requestWithdrawal);

// 4. Paginated Ledger of User Financial Transactions
router.get('/transactions', authMiddleware, walletController.listTransactions);

// 5. Paystack Asynchronous Webhook Handler
router.post('/paystack/webhook', walletController.handlePaystackWebhook);

module.exports = router;
