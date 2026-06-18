const express = require('express');
const { Op } = require('sequelize');
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { LeaveRequest, LeaveBalance } = require('../models');

const router = express.Router();

// GET /api/leaves
router.get('/', auth, async (req, res, next) => {
  try {
    const where = { employeeId: req.employee.id };

    if (req.query.status) where.status = req.query.status;
    if (req.query.year) {
      const year = parseInt(req.query.year);
      where.startDate = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      };
    }

    const leaves = await LeaveRequest.findAll({
      where,
      order: [['startDate', 'DESC']],
    });

    res.json(leaves);
  } catch (error) {
    next(error);
  }
});

// GET /api/leaves/balances
router.get('/balances', auth, async (req, res, next) => {
  try {
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    const balances = await LeaveBalance.findAll({
      where: { employeeId: req.employee.id, year },
    });

    const result = {};
    const leaveTypes = ['conges_payes', 'rtt', 'maladie', 'sans_solde', 'maternite', 'paternite'];
    for (const type of leaveTypes) {
      const balance = balances.find((b) => b.type === type);
      result[type] = balance
        ? { total: parseFloat(balance.total), used: parseFloat(balance.used), remaining: parseFloat(balance.remaining) }
        : { total: 0, used: 0, remaining: 0 };
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/leaves
router.post(
  '/',
  auth,
  [
    body('type')
      .isIn(['conges_payes', 'rtt', 'maladie', 'sans_solde', 'maternite', 'paternite'])
      .withMessage('Invalid leave type'),
    body('startDate').isDate().withMessage('startDate must be a valid date'),
    body('endDate').isDate().withMessage('endDate must be a valid date'),
    body('daysCount').isFloat({ min: 0.5 }).withMessage('daysCount must be at least 0.5'),
    body('reason').optional().trim(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation error', details: errors.array() });
      }

      const { type, startDate, endDate, daysCount, reason } = req.body;

      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ error: 'startDate must be before or equal to endDate' });
      }

      // Check for overlapping leave requests
      const overlap = await LeaveRequest.findOne({
        where: {
          employeeId: req.employee.id,
          status: { [Op.in]: ['pending', 'approved'] },
          [Op.or]: [
            { startDate: { [Op.between]: [startDate, endDate] } },
            { endDate: { [Op.between]: [startDate, endDate] } },
            {
              startDate: { [Op.lte]: startDate },
              endDate: { [Op.gte]: endDate },
            },
          ],
        },
      });

      if (overlap) {
        return res.status(400).json({ error: 'Leave request overlaps with an existing request' });
      }

      const leaveRequest = await LeaveRequest.create({
        employeeId: req.employee.id,
        type,
        startDate,
        endDate,
        daysCount,
        reason,
        status: 'pending',
      });

      // Async push to SIRH (best effort)
      try {
        const hrSyncService = require('../services/hrSyncService');
        hrSyncService.pushLeaveRequest(leaveRequest).catch((err) =>
          console.error('SIRH push failed:', err.message)
        );
      } catch (e) {
        // hrSyncService may not be initialized
      }

      res.status(201).json(leaveRequest);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/leaves/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findOne({
      where: { id: req.params.id, employeeId: req.employee.id },
    });

    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.json(leave);
  } catch (error) {
    next(error);
  }
});

// PUT /api/leaves/:id/cancel
router.put('/:id/cancel', auth, async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findOne({
      where: { id: req.params.id, employeeId: req.employee.id },
    });

    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending leave requests can be cancelled' });
    }

    await leave.update({ status: 'cancelled' });
    res.json(leave);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
