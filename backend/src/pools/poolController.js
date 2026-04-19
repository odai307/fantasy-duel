const poolService = require('./poolService');
const {
  validateCreatePoolInput,
  validateListPoolsQuery,
  validatePoolIdParams,
} = require('./poolValidation');

function sendError(res, error) {
  const status = error.status || 500;
  return res.status(status).json({
    message: error.message || 'Internal server error',
    ...(error.details ? { errors: error.details } : {}),
  });
}

async function createPool(req, res) {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const validatedInput = validateCreatePoolInput(req.body);
    const result = await poolService.createPool(validatedInput, userId);
    return res.status(201).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

async function listPools(req, res) {
  try {
    const validatedQuery = validateListPoolsQuery(req.query);
    const result = await poolService.listPools(validatedQuery);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

async function getPoolById(req, res) {
  try {
    const { id } = validatePoolIdParams(req.params);
    const result = await poolService.getPoolById(id);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = {
  createPool,
  listPools,
  getPoolById,
};
