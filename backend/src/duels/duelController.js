const duelService = require('./duelService');
const {
  validateCreateDuelInput,
  validateJoinByCodeInput,
  validateDuelIdParams,
  validateListDuelsQuery,
} = require('./duelValidation');
const asyncHandler = require('../shared/middleware/asyncHandler');
const { makeError } = require('../shared/errors');

const createDuel = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) throw makeError(401, 'Unauthorized');
  const input = validateCreateDuelInput(req.body);
  const result = await duelService.createDuel(input, userId);
  return res.status(201).json(result);
});

const joinDuelByCode = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) throw makeError(401, 'Unauthorized');
  const input = validateJoinByCodeInput(req.body);
  const result = await duelService.joinDuelByCode(userId, input);
  return res.status(200).json(result);
});

const getDuelById = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) throw makeError(401, 'Unauthorized');
  const { id } = validateDuelIdParams(req.params);
  const result = await duelService.getDuelById(id, userId);
  return res.status(200).json(result);
});

const listDuels = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) throw makeError(401, 'Unauthorized');
  const query = validateListDuelsQuery(req.query);
  const result = await duelService.listDuels(userId, query);
  return res.status(200).json(result);
});

module.exports = {
  createDuel,
  joinDuelByCode,
  getDuelById,
  listDuels,
};
