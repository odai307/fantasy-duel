const DEFAULT_ERROR_BY_STATUS = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_SERVER_ERROR',
};

class AppError extends Error {
  constructor({ status = 500, code, message = 'Internal server error', details } = {}) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code || DEFAULT_ERROR_BY_STATUS[status] || DEFAULT_ERROR_BY_STATUS[500];
    if (details !== undefined) {
      this.details = details;
    }
  }
}

function toAppError(error, fallbackMessage = 'Internal server error') {
  if (error instanceof AppError) {
    return error;
  }

  const status = Number(error?.status) || 500;
  const code = error?.code || DEFAULT_ERROR_BY_STATUS[status] || DEFAULT_ERROR_BY_STATUS[500];
  const message = error?.message || fallbackMessage;

  return new AppError({
    status,
    code,
    message,
    details: error?.details,
  });
}

function makeError(status, message, code, details) {
  return new AppError({ status, message, code, details });
}

module.exports = {
  AppError,
  makeError,
  toAppError,
  DEFAULT_ERROR_BY_STATUS,
};
