function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = process.hrtime.bigint() - startedAt;
    const durationMs = Number(durationNs) / 1e6;

    const log = {
      event: 'http_request',
      requestId: req.requestId || null,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip || req.socket?.remoteAddress || null,
      userAgent: req.headers['user-agent'] || null,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 500) {
      console.error('[request]', log);
      return;
    }

    console.log('[request]', log);
  });

  return next();
}

module.exports = requestLogger;
