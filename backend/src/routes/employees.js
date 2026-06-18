const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/employees/me
router.get('/me', auth, async (req, res, next) => {
  try {
    res.json(req.employee.toJSON());
  } catch (error) {
    next(error);
  }
});

// PUT /api/employees/me
router.put(
  '/me',
  auth,
  [
    body('firstName').optional().notEmpty().trim(),
    body('lastName').optional().notEmpty().trim(),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation error', details: errors.array() });
      }

      const allowedFields = ['firstName', 'lastName', 'phone'];
      const updates = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      await req.employee.update(updates);
      res.json(req.employee.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
