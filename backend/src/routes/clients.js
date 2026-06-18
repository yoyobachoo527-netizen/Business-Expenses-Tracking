const express = require('express');
const auth = require('../middleware/auth');
const { Client } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.findAll({ where: { company_id: req.user.company_id }, order: [['name', 'ASC']] });
    res.json(clients);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const client = await Client.create({ ...req.body, company_id: req.user.company_id });
    res.status(201).json(client);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOne({ where: { id: req.params.id, company_id: req.user.company_id } });
    if (!client) return res.status(404).json({ error: 'Client non trouvé' });
    await client.update(req.body);
    res.json(client);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOne({ where: { id: req.params.id, company_id: req.user.company_id } });
    if (!client) return res.status(404).json({ error: 'Client non trouvé' });
    await client.destroy();
    res.json({ message: 'Client supprimé' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
