const authService = require('./authService');
const { validateRegisterInput, validateSetupFplInput, validateLoginInput } = require('./authValidation');
const asyncHandler = require('../shared/middleware/asyncHandler');
const { requireAuthenticatedUser } = require('../shared/authHelper');

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
  const userId = requireAuthenticatedUser(req);
  const result = await authService.getMe(userId);
  return res.status(200).json(result);
});

const validateFpl = asyncHandler(async (req, res) => {
  requireAuthenticatedUser(req);
  const { fplTeamId } = validateSetupFplInput(req.body);
  const result = await authService.validateFplTeam(fplTeamId);
  return res.status(200).json(result);
});

const setupFpl = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const { fplTeamId } = validateSetupFplInput(req.body);
  const result = await authService.setupFpl(userId, fplTeamId);
  return res.status(200).json(result);
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = requireAuthenticatedUser(req);
  const { firstName, lastName } = req.body;
  const result = await authService.updateProfile(userId, { firstName, lastName });
  return res.status(200).json(result);
});

module.exports = {
  register,
  login,
  me,
  validateFpl,
  setupFpl,
  updateProfile,
};
