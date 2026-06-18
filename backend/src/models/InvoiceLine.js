const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvoiceLine = sequelize.define('InvoiceLine', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoice_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING(255), allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 1 },
  unit_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  tva_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 20, comment: 'TVA: 20%, 14%, 10%, 7%' },
  total: { type: DataTypes.DECIMAL(15, 2), allowNull: false }
}, {
  tableName: 'invoice_lines',
  timestamps: true,
  underscored: true
});

module.exports = InvoiceLine;
