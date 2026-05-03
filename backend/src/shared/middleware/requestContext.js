const crypto = require('crypto');

function createRequestId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function requestContext(req, res, next) {
  const headerRequestId = req.headers['x-request-id'];
  const requestId = typeof headerRequestId === 'string' && headerRequestId.trim()
    ? headerRequestId.trim()
    : createRequestId();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  return next();
}

module.exports = requestContext;
