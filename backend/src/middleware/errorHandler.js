const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message || err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors ? err.errors.map((e) => e.message) : [err.message],
    });
  }

  // Express-validator errors
  if (err.type === 'validation') {
    return res.status(400).json({ error: 'Validation error', details: err.details });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Custom status errors
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Known HTTP error codes
  if (err.statusCode === 400) return res.status(400).json({ error: err.message });
  if (err.statusCode === 401) return res.status(401).json({ error: err.message });
  if (err.statusCode === 403) return res.status(403).json({ error: err.message });
  if (err.statusCode === 404) return res.status(404).json({ error: err.message });

  // Default 500
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

module.exports = errorHandler;
