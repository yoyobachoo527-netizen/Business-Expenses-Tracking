const express = require('express');
const auth = require('../middleware/auth');
const { Invoice, InvoiceLine, Client } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { company_id: req.user.company_id },
      include: [Client, InvoiceLine],
      order: [['date', 'DESC']]
    });
    res.json(invoices);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { lines, ...invoiceData } = req.body;
    invoiceData.company_id = req.user.company_id;
    const invoice = await Invoice.create(invoiceData);
    if (lines && lines.length > 0) {
      await InvoiceLine.bulkCreate(lines.map(l => ({ ...l, invoice_id: invoice.id })));
    }
    const full = await Invoice.findByPk(invoice.id, { include: [Client, InvoiceLine] });
    res.status(201).json(full);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, company_id: req.user.company_id },
      include: [Client, InvoiceLine]
    });
    if (!invoice) return res.status(404).json({ error: 'Facture non trouvée' });
    res.json(invoice);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ where: { id: req.params.id, company_id: req.user.company_id } });
    if (!invoice) return res.status(404).json({ error: 'Facture non trouvée' });
    const { lines, ...invoiceData } = req.body;
    await invoice.update(invoiceData);
    if (lines) {
      await InvoiceLine.destroy({ where: { invoice_id: invoice.id } });
      await InvoiceLine.bulkCreate(lines.map(l => ({ ...l, invoice_id: invoice.id })));
    }
    const full = await Invoice.findByPk(invoice.id, { include: [Client, InvoiceLine] });
    res.json(full);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ where: { id: req.params.id, company_id: req.user.company_id } });
    if (!invoice) return res.status(404).json({ error: 'Facture non trouvée' });
    await InvoiceLine.destroy({ where: { invoice_id: invoice.id } });
    await invoice.destroy();
    res.json({ message: 'Facture supprimée' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
