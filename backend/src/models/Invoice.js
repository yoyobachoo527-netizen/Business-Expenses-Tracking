const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  number: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  due_date: { type: DataTypes.DATEONLY },
  client_id: { type: DataTypes.INTEGER },
  company_id: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM('brouillon', 'envoyée', 'payée', 'annulée'),
    defaultValue: 'brouillon'
  },
  subtotal: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  tva_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 20 },
  tva_amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  notes: { type: DataTypes.TEXT }
}, {
  tableName: 'invoices',
  timestamps: true,
  underscored: true
});

module.exports = Invoice;
