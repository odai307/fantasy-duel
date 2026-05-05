const { makeError } = require('./errors');

function requireAuthenticatedUser(req) {
  const userId = req.user?.sub;

  if (!userId) {
    throw makeError(401, 'Unauthorized');
  }

  return userId;
}

module.exports = {
  requireAuthenticatedUser,
};
