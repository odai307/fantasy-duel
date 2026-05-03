const authService = require('./authService');
const { validateRegisterInput, validateLoginInput } = require('./authValidation');
const asyncHandler = require('../shared/middleware/asyncHandler');
const { makeError } = require('../shared/errors');

const register = asyncHandler(async (req, res) => {
  const validatedInput = validateRegisterInput(req.body);
  const result = await authService.register(validatedInput);
  return res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const validatedInput = validateLoginInput(req.body);
  const result = await authService.login(validatedInput);
  return res.status(200).json(result);
});

const me = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;

  if (!userId) {
    throw makeError(401, 'Unauthorized');
  }

  const result = await authService.getMe(userId);
  return res.status(200).json(result);
});

module.exports = {
  register,
  login,
  me
};
