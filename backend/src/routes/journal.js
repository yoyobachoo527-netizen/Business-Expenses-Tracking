const express = require('express');
const auth = require('../middleware/auth');
const { JournalEntry, JournalLine, Account } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.findAll({
      where: { company_id: req.user.company_id },
      include: [{ model: JournalLine, include: [Account] }],
      order: [['date', 'DESC']]
    });
    res.json(entries);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { date, reference, description, piece_number, lines } = req.body;
    const entry = await JournalEntry.create({
      date, reference, description, piece_number,
      company_id: req.user.company_id,
      created_by: req.user.id
    });
    if (lines && lines.length > 0) {
      await JournalLine.bulkCreate(lines.map(l => ({ ...l, journal_entry_id: entry.id })));
    }
    const full = await JournalEntry.findByPk(entry.id, { include: [{ model: JournalLine, include: [Account] }] });
    res.status(201).json(full);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      where: { id: req.params.id, company_id: req.user.company_id },
      include: [{ model: JournalLine, include: [Account] }]
    });
    if (!entry) return res.status(404).json({ error: 'Écriture non trouvée' });
    res.json(entry);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({ where: { id: req.params.id, company_id: req.user.company_id } });
    if (!entry) return res.status(404).json({ error: 'Écriture non trouvée' });
    await JournalLine.destroy({ where: { journal_entry_id: entry.id } });
    await entry.destroy();
    res.json({ message: 'Écriture supprimée' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
