require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const leaveRoutes = require('./routes/leaves');
const absenceRoutes = require('./routes/absences');
const payslipRoutes = require('./routes/payslips');

const app = express();

// Security middleware
app.use(helmet());

// CORS
const corsOptions =
  process.env.NODE_ENV === 'production'
    ? { origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : false }
    : { origin: '*' };
app.use(cors(corsOptions));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter rate limit for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts, please try again later.' },
});
app.use('/api/auth/login', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/payslips', payslipRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`[App] Created upload directory: ${uploadDir}`);
}

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] Database connection established');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('[DB] Database synced');

    const server = app.listen(PORT, () => {
      console.log(`[App] Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Start SIRH sync service
    try {
      const hrSyncService = require('./services/hrSyncService');
      hrSyncService.startSync();
    } catch (err) {
      console.error('[App] Failed to start HR sync service:', err.message);
    }

    // Graceful shutdown
    const shutdown = async () => {
      console.log('[App] Shutting down gracefully...');
      server.close(async () => {
        try {
          const hrSyncService = require('./services/hrSyncService');
          hrSyncService.stopSync();
        } catch (e) {}
        await sequelize.close();
        console.log('[App] Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return server;
  } catch (error) {
    console.error('[App] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
