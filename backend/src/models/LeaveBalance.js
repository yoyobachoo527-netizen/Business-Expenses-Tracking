const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class LeaveBalance extends Model {}

LeaveBalance.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'employees', key: 'id' },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'conges_payes',
        'rtt',
        'maladie',
        'sans_solde',
        'maternite',
        'paternite'
      ),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(5, 1),
      defaultValue: 0,
    },
    used: {
      type: DataTypes.DECIMAL(5, 1),
      defaultValue: 0,
    },
    remaining: {
      type: DataTypes.DECIMAL(5, 1),
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'LeaveBalance',
    tableName: 'leave_balances',
    timestamps: true,
  }
);

module.exports = LeaveBalance;
