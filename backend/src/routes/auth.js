const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { Employee } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

const generateTokens = (employee) => {
  const accessToken = jwt.sign(
    { id: employee.id, email: employee.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: employee.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
};

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation error', details: errors.array() });
      }

      const { email, password } = req.body;
      const employee = await Employee.findByCredentials(email, password);
      const { accessToken, refreshToken } = generateTokens(employee);

      await employee.update({ refreshToken });

      res.json({
        accessToken,
        refreshToken,
        employee: employee.toJSON(),
      });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      next(error);
    }
  }
);

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const employee = await Employee.findOne({
      where: { id: decoded.id, refreshToken, isActive: true },
    });

    if (!employee) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign(
      { id: employee.id, email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', auth, async (req, res, next) => {
  try {
    await req.employee.update({ refreshToken: null });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/fcm-token
router.put(
  '/fcm-token',
  auth,
  [body('fcmToken').notEmpty().withMessage('FCM token is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation error', details: errors.array() });
      }

      await req.employee.update({ fcmToken: req.body.fcmToken });
      res.json({ message: 'FCM token updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
