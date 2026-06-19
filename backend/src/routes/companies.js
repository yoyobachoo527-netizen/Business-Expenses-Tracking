const express = require('express');
const auth = require('../middleware/auth');
const { Company } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.user.company_id);
    res.json(company);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ error: 'Entreprise non trouvée' });
    await company.update(req.body);
    res.json(company);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
