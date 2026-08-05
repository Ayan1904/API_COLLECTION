// ─── Not Found Handler ────────────────────────────────────────────────────────
const notFound = (req, res, next) => {
  const error = new Error(`Route not found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// ─── Central Error Handler ────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    err.message = 'Resource not found — invalid ID format';
    res.status(404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.message = `Duplicate value for field: "${field}". Please use a different value.`;
    res.status(400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    err.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    res.status(400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token. Please log in again.';
    res.status(401);
  }

  if (err.name === 'TokenExpiredError') {
    err.message = 'Token expired. Please log in again.';
    res.status(401);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
