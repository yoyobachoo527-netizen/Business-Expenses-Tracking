const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class PaySlip extends Model {}

PaySlip.init(
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
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 12 },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    grossSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    netSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    employerCharges: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    employeeCharges: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    pdfPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sirhReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PaySlip',
    tableName: 'pay_slips',
    timestamps: true,
  }
);

module.exports = PaySlip;
