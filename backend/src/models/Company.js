const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  ice: { type: DataTypes.STRING(20), unique: true, comment: 'Identifiant Commun de l\'Entreprise' },
  rc: { type: DataTypes.STRING(50), comment: 'Registre de Commerce' },
  if_fiscal: { type: DataTypes.STRING(20), comment: 'Identifiant Fiscal' },
  cnss: { type: DataTypes.STRING(20), comment: 'CNSS' },
  taxe_prof: { type: DataTypes.STRING(20), comment: 'Taxe Professionnelle' },
  address: { type: DataTypes.TEXT },
  city: { type: DataTypes.STRING(100) },
  phone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(150) },
  logo_url: { type: DataTypes.STRING(500) }
}, {
  tableName: 'companies',
  timestamps: true,
  underscored: true
});

module.exports = Company;
