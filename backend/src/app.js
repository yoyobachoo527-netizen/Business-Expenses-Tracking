const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const companiesRoutes = require('./routes/companies');
const accountsRoutes = require('./routes/accounts');
const journalRoutes = require('./routes/journal');
const invoicesRoutes = require('./routes/invoices');
const clientsRoutes = require('./routes/clients');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/clients', clientsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API comptabilité PME Maroc opérationnelle' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

module.exports = app;
