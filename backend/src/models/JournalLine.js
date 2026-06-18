const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JournalLine = sequelize.define('JournalLine', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  journal_entry_id: { type: DataTypes.INTEGER, allowNull: false },
  account_id: { type: DataTypes.INTEGER, allowNull: false },
  debit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  credit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  label: { type: DataTypes.STRING(255) }
}, {
  tableName: 'journal_lines',
  timestamps: true,
  underscored: true
});

module.exports = JournalLine;
