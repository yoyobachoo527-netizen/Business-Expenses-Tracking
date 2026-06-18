const express = require('express');
const auth = require('../middleware/auth');
const { Account } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const accounts = await Account.findAll({ order: [['code', 'ASC']] });
    res.json(accounts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const account = await Account.create(req.body);
    res.status(201).json(account);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
