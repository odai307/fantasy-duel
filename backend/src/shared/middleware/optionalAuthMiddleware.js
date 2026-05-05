const jwt = require('jsonwebtoken');

const env = require('../config/env');

function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  req.auth = { status: 'anonymous' };
  res.setHeader('x-auth-status', 'anonymous');

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
    req.auth = { status: 'authenticated', user: payload };
    res.setHeader('x-auth-status', 'authenticated');
    return next();
  } catch (error) {
    req.auth = {
      status: 'invalid',
      code: 'INVALID_TOKEN',
      message: error.message,
    };
    res.setHeader('x-auth-status', 'invalid');
    res.setHeader('x-auth-error-code', 'INVALID_TOKEN');
    return next();
  }
}

module.exports = optionalAuthMiddleware;
