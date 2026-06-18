const express = require('express');
const path = require('path');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { Absence } = require('../models');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'justification-' + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/absences
router.get('/', auth, async (req, res, next) => {
  try {
    const where = { employeeId: req.employee.id };

    if (req.query.year) {
      const year = parseInt(req.query.year);
      const { Op } = require('sequelize');
      where.date = { [Op.between]: [`${year}-01-01`, `${year}-12-31`] };
    }

    if (req.query.justified !== undefined) {
      where.justified = req.query.justified === 'true';
    }

    const absences = await Absence.findAll({
      where,
      order: [['date', 'DESC']],
    });

    res.json(absences);
  } catch (error) {
    next(error);
  }
});

// POST /api/absences
router.post(
  '/',
  auth,
  [
    body('date').isDate().withMessage('date must be a valid date'),
    body('type')
      .isIn(['maladie', 'accident_travail', 'evenement_familial', 'autre'])
      .withMessage('Invalid absence type'),
    body('comment').optional().trim(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation error', details: errors.array() });
      }

      const { date, type, comment } = req.body;

      const absence = await Absence.create({
        employeeId: req.employee.id,
        date,
        type,
        comment,
      });

      res.status(201).json(absence);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/absences/:id
router.put('/:id', auth, upload.single('justificationFile'), async (req, res, next) => {
  try {
    const absence = await Absence.findOne({
      where: { id: req.params.id, employeeId: req.employee.id },
    });

    if (!absence) {
      return res.status(404).json({ error: 'Absence not found' });
    }

    const updates = {};
    if (req.body.comment !== undefined) updates.comment = req.body.comment;
    if (req.body.justified !== undefined) updates.justified = req.body.justified === 'true';
    if (req.file) {
      updates.justificationFile = req.file.path;
      updates.justified = true;
    }

    await absence.update(updates);
    res.json(absence);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
