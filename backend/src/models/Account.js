const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING(10), allowNull: false, unique: true, comment: 'Code CGNC' },
  label: { type: DataTypes.STRING(200), allowNull: false },
  type: {
    type: DataTypes.ENUM('actif', 'passif', 'charge', 'produit', 'tresorerie'),
    allowNull: false
  },
  parent_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'accounts',
  timestamps: true,
  underscored: true
});

module.exports = Account;
