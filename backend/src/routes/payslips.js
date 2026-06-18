const express = require('express');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { PaySlip } = require('../models');

const router = express.Router();

// GET /api/payslips
router.get('/', auth, async (req, res, next) => {
  try {
    const payslips = await PaySlip.findAll({
      where: { employeeId: req.employee.id },
      order: [
        ['year', 'DESC'],
        ['month', 'DESC'],
      ],
    });

    res.json(payslips);
  } catch (error) {
    next(error);
  }
});

// GET /api/payslips/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const payslip = await PaySlip.findOne({
      where: { id: req.params.id, employeeId: req.employee.id },
    });

    if (!payslip) {
      return res.status(404).json({ error: 'Pay slip not found' });
    }

    res.json(payslip);
  } catch (error) {
    next(error);
  }
});

// GET /api/payslips/:id/download
router.get('/:id/download', auth, async (req, res, next) => {
  try {
    const payslip = await PaySlip.findOne({
      where: { id: req.params.id, employeeId: req.employee.id },
    });

    if (!payslip) {
      return res.status(404).json({ error: 'Pay slip not found' });
    }

    if (!payslip.pdfPath) {
      return res.status(404).json({ error: 'PDF not available for this pay slip' });
    }

    const absolutePath = path.resolve(payslip.pdfPath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'PDF file not found on server' });
    }

    const filename = `fiche-paie-${payslip.year}-${String(payslip.month).padStart(2, '0')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    fs.createReadStream(absolutePath).pipe(res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
