const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JournalEntry = sequelize.define('JournalEntry', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  reference: { type: DataTypes.STRING(50) },
  description: { type: DataTypes.TEXT },
  piece_number: { type: DataTypes.STRING(50), comment: 'Numéro de pièce justificative' },
  company_id: { type: DataTypes.INTEGER, allowNull: false },
  created_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'journal_entries',
  timestamps: true,
  underscored: true
});

module.exports = JournalEntry;
