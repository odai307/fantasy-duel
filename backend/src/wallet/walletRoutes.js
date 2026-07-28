const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const prisma = require('../shared/config/db');
const asyncHandler = require('../shared/middleware/asyncHandler');
const authMiddleware = require('../shared/middleware/authMiddleware');
const { requireAuthenticatedUser } = require('../shared/authHelper');
const { makeError } = require('../shared/errors');
const env = require('../shared/config/env');
const { initializeTransaction, verifyTransaction } = require('./paystackService');

// 1. Initialize Deposit
router.post(
  '/deposit/initialize',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userId = requireAuthenticatedUser(req);
    const { amount } = req.body;

    const depositAmount = Number(amount);
    if (!Number.isFinite(depositAmount) || depositAmount < 1) {
      throw makeError(400, 'Minimum deposit amount is GHS 1.00');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      throw makeError(404, 'User not found');
    }

    const reference = `fd_dep_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const originUrl = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || env.frontendUrl || 'http://localhost:5174';
    const callbackUrl = `${originUrl}/wallet?verify=${reference}`;

    const paystackData = await initializeTransaction({
      email: user.email,
      amountGhs: depositAmount,
      reference,
      callbackUrl,
      metadata: {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
      },
    });

    // Record pending transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: depositAmount,
        type: 'DEPOSIT',
        status: 'PENDING',
        reference,
        description: `Paystack Deposit (GHS ${depositAmount.toFixed(2)})`,
        metadata: {
          paystackAccessCode: paystackData.accessCode,
        },
      },
    });

    res.status(201).json({
      authorizationUrl: paystackData.authorizationUrl,
      reference,
      accessCode: paystackData.accessCode,
    });
  })
);

// 2. Verify Deposit Reference
router.post(
  '/deposit/verify',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userId = requireAuthenticatedUser(req);
    const { reference } = req.body;

    if (!reference) {
      throw makeError(400, 'Reference is required');
    }

    const dbTx = await prisma.transaction.findUnique({
      where: { reference },
    });

    if (!dbTx || dbTx.userId !== userId) {
      throw makeError(404, 'Transaction reference not found');
    }

    if (dbTx.status === 'SUCCESS') {
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true },
      });
      return res.json({
        message: 'Transaction already verified and credited',
        walletBalance: updatedUser.walletBalance,
        transaction: dbTx,
      });
    }

    // Verify directly with Paystack API
    const paystackResult = await verifyTransaction(reference);

    if (paystackResult.status !== 'success') {
      const failureStatus = paystackResult.status === 'abandoned' ? 'FAILED' : 'FAILED';
      await prisma.transaction.update({
        where: { id: dbTx.id },
        data: { status: failureStatus },
      });
      throw makeError(400, `Payment ${paystackResult.status === 'abandoned' ? 'was cancelled' : 'failed'} (Status: ${paystackResult.status})`);
    }

    // Atomically credit user's wallet
    const [updatedUser, updatedTx] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            increment: paystackResult.amountGhs,
          },
        },
        select: { id: true, walletBalance: true },
      }),
      prisma.transaction.update({
        where: { id: dbTx.id },
        data: {
          status: 'SUCCESS',
          amount: paystackResult.amountGhs,
          metadata: {
            channel: paystackResult.channel,
            paidAt: paystackResult.paidAt,
          },
        },
      }),
    ]);

    res.json({
      message: `Deposit of GHS ${paystackResult.amountGhs.toFixed(2)} successful!`,
      walletBalance: updatedUser.walletBalance,
      transaction: updatedTx,
    });
  })
);

// 3. Request Withdrawal (Payout)
router.post(
  '/withdraw',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userId = requireAuthenticatedUser(req);
    const { amount, provider, accountNumber, accountName } = req.body;

    const withdrawAmount = Number(amount);
    if (!Number.isFinite(withdrawAmount) || withdrawAmount < 1) {
      throw makeError(400, 'Minimum withdrawal amount is GHS 1.00');
    }

    if (!accountNumber || !accountName) {
      throw makeError(400, 'Account/Phone number and Account holder name are required');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, walletBalance: true },
    });

    const currentBalance = Number(user?.walletBalance || 0);
    if (currentBalance < withdrawAmount) {
      throw makeError(400, `Insufficient wallet balance. You have GHS ${currentBalance.toFixed(2)} available.`);
    }

    const reference = `fd_wth_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Atomically decrement balance and record withdrawal
    const [updatedUser, withdrawalTx] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: withdrawAmount,
          },
        },
        select: { id: true, walletBalance: true },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          amount: withdrawAmount,
          type: 'WITHDRAWAL',
          status: 'SUCCESS',
          reference,
          description: `Payout to ${provider || 'MoMo'} (${accountNumber})`,
          metadata: {
            provider: provider || 'MTN MoMo',
            accountNumber,
            accountName,
            processedAt: new Date().toISOString(),
          },
        },
      }),
    ]);

    res.status(201).json({
      message: `Withdrawal of GHS ${withdrawAmount.toFixed(2)} processed successfully!`,
      walletBalance: updatedUser.walletBalance,
      transaction: withdrawalTx,
    });
  })
);

// 4. User Transaction History (Paginated)
router.get(
  '/transactions',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userId = requireAuthenticatedUser(req);
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 15)));
    const skip = (page - 1) * limit;

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: { userId },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    res.json({
      transactions,
      page,
      totalPages,
      totalCount,
      hasMore,
    });
  })
);

// 5. Paystack Webhook Handler
router.post(
  '/paystack/webhook',
  asyncHandler(async (req, res) => {
    const signature = req.headers['x-paystack-signature'];
    const secret = env.paystackWebhookSecret || env.paystackSecretKey;

    if (secret && signature) {
      const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash !== signature) {
        return res.status(400).send('Invalid signature');
      }
    }

    const event = req.body;
    if (event?.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const amountGhs = Number(data.amount) / 100;

      const dbTx = await prisma.transaction.findUnique({
        where: { reference },
      });

      if (dbTx && dbTx.status !== 'SUCCESS') {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: dbTx.userId },
            data: {
              walletBalance: {
                increment: amountGhs,
              },
            },
          }),
          prisma.transaction.update({
            where: { id: dbTx.id },
            data: {
              status: 'SUCCESS',
              amount: amountGhs,
              metadata: {
                webhookProcessedAt: new Date().toISOString(),
                channel: data.channel,
              },
            },
          }),
        ]);
      }
    }

    res.status(200).send('Webhook received');
  })
);

module.exports = router;
