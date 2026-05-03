const jwt = require('jsonwebtoken');

const env = require('../config/env');

function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
  } catch (error) {
    // Ignore invalid/expired token here so public listing still works.
  }

  return next();
}

module.exports = optionalAuthMiddleware;
