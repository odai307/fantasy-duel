const { AppError, DEFAULT_ERROR_BY_STATUS, toAppError } = require('../errors');

function errorHandler(error, req, res, next) {
  const appError = toAppError(error);
  const status = appError.status || 500;
  const code = appError.code || DEFAULT_ERROR_BY_STATUS[status] || DEFAULT_ERROR_BY_STATUS[500];
  const requestId = req.requestId || null;

  if (status >= 500) {
    console.error('[error]', {
      requestId,
      code,
      status,
      method: req.method,
      path: req.originalUrl,
      message: appError.message,
      stack: appError.stack,
    });
  }

  const responsePayload = {
    requestId,
    status,
    message: appError.message,
    error: {
      requestId,
      status,
      code,
      message: appError.message,
      ...(appError.details ? { details: appError.details } : {}),
    },
  };

  if (appError.details) {
    responsePayload.errors = appError.details;
  }

  return res.status(status).json(responsePayload);
}

function notFoundHandler(req, res) {
  const error = new AppError({
    status: 404,
    code: 'NOT_FOUND',
    message: 'Route not found',
  });

  const responsePayload = {
    requestId: req.requestId || null,
    status: error.status,
    message: error.message,
    error: {
      requestId: req.requestId || null,
      status: error.status,
      code: error.code,
      message: error.message,
    },
  };

  return res.status(404).json(responsePayload);
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
