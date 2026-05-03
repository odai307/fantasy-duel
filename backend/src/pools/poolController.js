const poolService = require('./poolService');
const {
  validateCreatePoolInput,
  validateListPoolsQuery,
  validatePoolIdParams,
  validatePoolLeaderboardQuery,
  validateJoinPoolInput,
  validateJoinPoolByCodeInput,
} = require('./poolValidation');
const asyncHandler = require('../shared/middleware/asyncHandler');
const { makeError } = require('../shared/errors');

const createPool = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) throw makeError(401, 'Unauthorized');
  const validatedInput = validateCreatePoolInput(req.body);
  const result = await poolService.createPool(validatedInput, userId);
  return res.status(201).json(result);
});

const listPools = asyncHandler(async (req, res) => {
  const validatedQuery = validateListPoolsQuery(req.query);
  const userId = req.user?.sub || null;
  const result = await poolService.listPools(validatedQuery, userId);
  return res.status(200).json(result);
});

const getPoolById = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || null;
  const { id } = validatePoolIdParams(req.params);
  const result = await poolService.getPoolById(id, userId);
  return res.status(200).json(result);
});

const getPoolLeaderboard = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || null;
  const { id } = validatePoolIdParams(req.params);
  const query = validatePoolLeaderboardQuery(req.query);
  const result = await poolService.getPoolLeaderboard(id, userId, query);
  return res.status(200).json(result);
});

const joinPool = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) throw makeError(401, 'Unauthorized');
  const { id } = validatePoolIdParams(req.params);
  const input = validateJoinPoolInput(req.body);
  const result = await poolService.joinPool(id, userId, input);
  return res.status(200).json(result);
});

const joinPoolByCode = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) throw makeError(401, 'Unauthorized');
  const input = validateJoinPoolByCodeInput(req.body);
  const result = await poolService.joinPoolByCode(userId, input);
  return res.status(200).json(result);
});

module.exports = {
  createPool,
  listPools,
  getPoolById,
  getPoolLeaderboard,
  joinPool,
  joinPoolByCode,
};
