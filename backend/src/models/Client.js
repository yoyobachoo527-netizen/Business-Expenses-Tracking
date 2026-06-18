const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  ice: { type: DataTypes.STRING(20) },
  address: { type: DataTypes.TEXT },
  city: { type: DataTypes.STRING(100) },
  phone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(150) },
  company_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'clients',
  timestamps: true,
  underscored: true
});

module.exports = Client;
