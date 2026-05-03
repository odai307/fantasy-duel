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
    });
  }

  return res.status(status).json({
    requestId,
    message: appError.message,
    ...(appError.details ? { errors: appError.details } : {}),
    error: {
      requestId,
      code,
      message: appError.message,
      ...(appError.details ? { details: appError.details } : {}),
    },
  });
}

function notFoundHandler(req, res) {
  const error = new AppError({
    status: 404,
    code: 'NOT_FOUND',
    message: 'Route not found',
  });

  return res.status(404).json({
    requestId: req.requestId || null,
    message: error.message,
    error: {
      requestId: req.requestId || null,
      code: error.code,
      message: error.message,
    },
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
