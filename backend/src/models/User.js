const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'comptable', 'viewer'),
    defaultValue: 'comptable'
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

module.exports = User;
