function notFound(req, res, _next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: message,
    ...(err.details ? { details: err.details } : {}),
  });
}

class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    if (details) this.details = details;
  }
}

module.exports = { notFound, errorHandler, HttpError };
