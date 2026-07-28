const duelService = require('./duelService');
const {
  validateCreateDuelInput,
  validateJoinByCodeInput,
  validateDuelIdParams,
  validateListDuelsQuery,
} = require('./duelValidation');
const asyncHandler = require('../shared/middleware/asyncHandler');
const { requireAuthenticatedUser } = require('../shared/authHelper');

const createDuel = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const input = validateCreateDuelInput(req.body);
  const result = await duelService.createDuel(input, userId);
  return res.status(201).json(result);
});

const joinDuelByCode = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const input = validateJoinByCodeInput(req.body);
  const result = await duelService.joinDuelByCode(userId, input);
  return res.status(200).json(result);
});

const settleDuel = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const { id } = validateDuelIdParams(req.params);
  const result = await duelService.settleDuel(id, userId);
  return res.status(200).json(result);
});

const cancelDuel = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const { id } = validateDuelIdParams(req.params);
  const result = await duelService.cancelDuel(id, userId);
  return res.status(200).json(result);
});

const getDuelById = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const { id } = validateDuelIdParams(req.params);
  const result = await duelService.getDuelById(id, userId);
  return res.status(200).json(result);
});

const listDuels = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const query = validateListDuelsQuery(req.query);
  const result = await duelService.listDuels(userId, query);
  return res.status(200).json(result);
});

module.exports = {
  createDuel,
  joinDuelByCode,
  settleDuel,
  cancelDuel,
  getDuelById,
  listDuels,
};
