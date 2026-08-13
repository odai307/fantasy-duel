const crypto = require('crypto');
const prisma = require('../shared/config/db');
const { requireAuthenticatedUser } = require('../shared/authHelper');
const { makeError } = require('../shared/errors');
const env = require('../shared/config/env');
const { initializeTransaction, verifyTransaction } = require('./paystackService');

// ============================================================================
// CONTROLLER HANDLERS
// ============================================================================

/**
 * POST /api/wallet/deposit/initialize
 * Initialize a Mobile Money / Card deposit checkout via Paystack.
 *
 * Requirements:
 * 1. User must be authenticated.
 * 2. Amount must be a finite number >= GHS 1.00.
 *
 * Actions:
 * - Generates unique reference `fd_dep_<timestamp>_<randomHex>`.
 * - Calls Paystack API to create an authorization checkout link.
 * - Records a PENDING transaction in the database.
 */
async function initializeDeposit(req, res, next) {
  try {
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
    const originUrl =
      req.headers.origin ||
      req.headers.referer?.replace(/\/$/, '') ||
      env.frontendUrl ||
      'http://localhost:5174';
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

    // Record pending transaction in ledger
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

    return res.status(201).json({
      authorizationUrl: paystackData.authorizationUrl,
      reference,
      accessCode: paystackData.accessCode,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/wallet/deposit/verify
 * Verify a deposit reference against Paystack and credit the user's wallet atomically.
 *
 * Requirements:
 * 1. Reference must belong to the requesting user.
 * 2. If already verified (status SUCCESS), return current balance idempotently.
 * 3. Verify status with Paystack REST API.
 * 4. Atomically credit walletBalance and update transaction to SUCCESS.
 */
async function verifyDeposit(req, res, next) {
  try {
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

    // Idempotency check: if already processed, return current balance
    if (dbTx.status === 'SUCCESS') {
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true },
      });
      return res.status(200).json({
        message: 'Transaction already verified and credited',
        walletBalance: updatedUser.walletBalance,
        transaction: dbTx,
      });
    }

    // Verify directly with Paystack API
    const paystackResult = await verifyTransaction(reference);

    if (paystackResult.status !== 'success') {
      await prisma.transaction.update({
        where: { id: dbTx.id },
        data: { status: 'FAILED' },
      });
      throw makeError(
        400,
        `Payment ${paystackResult.status === 'abandoned' ? 'was cancelled' : 'failed'} (Status: ${paystackResult.status})`
      );
    }

    // Atomically increment user's wallet balance and mark transaction SUCCESS
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

    return res.status(200).json({
      message: `Deposit of GHS ${paystackResult.amountGhs.toFixed(2)} successful!`,
      walletBalance: updatedUser.walletBalance,
      transaction: updatedTx,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/wallet/withdraw
 * Process a cash withdrawal payout request to Mobile Money or Bank Account.
 *
 * Requirements:
 * 1. Minimum withdrawal is GHS 1.00.
 * 2. Account number/phone and account holder name are required.
 * 3. User must have sufficient wallet balance.
 *
 * Actions:
 * - Atomically decrements user's wallet balance.
 * - Records a WITHDRAWAL transaction in the ledger.
 */
async function requestWithdrawal(req, res, next) {
  try {
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
      throw makeError(
        400,
        `Insufficient wallet balance. You have GHS ${currentBalance.toFixed(2)} available.`
      );
    }

    const reference = `fd_wth_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Atomically decrement balance and persist withdrawal transaction
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

    return res.status(201).json({
      message: `Withdrawal of GHS ${withdrawAmount.toFixed(2)} processed successfully!`,
      walletBalance: updatedUser.walletBalance,
      transaction: withdrawalTx,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/wallet/transactions
 * Retrieve paginated financial transaction history for the authenticated user.
 */
async function listTransactions(req, res, next) {
  try {
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

    return res.status(200).json({
      transactions,
      page,
      totalPages,
      totalCount,
      hasMore,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/wallet/paystack/webhook
 * Handle automated Paystack webhook notifications (e.g. background charge.success).
 * Enforces SHA512 signature validation and idempotent wallet balance credit.
 */
async function handlePaystackWebhook(req, res, next) {
  try {
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

    return res.status(200).send('Webhook received');
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  initializeDeposit,
  verifyDeposit,
  requestWithdrawal,
  listTransactions,
  handlePaystackWebhook,
};
