const authService = require('./authService');
const { validateRegisterInput, validateLoginInput } = require('./authValidation');

function sendError(res, error) {
  const status = error.status || 500;
  return res.status(status).json({
    message: error.message || 'Internal server error',
    ...(error.details ? { errors: error.details } : {})
  });
}

async function register(req, res) {
  try {
    const validatedInput = validateRegisterInput(req.body);
    const result = await authService.register(validatedInput);
    return res.status(201).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

async function login(req, res) {
  try {
    const validatedInput = validateLoginInput(req.body);
    const result = await authService.login(validatedInput);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

async function me(req, res) {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await authService.getMe(userId);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = {
  register,
  login,
  me
};
