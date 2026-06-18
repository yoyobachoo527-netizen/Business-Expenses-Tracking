const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Absence extends Model {}

Absence.init(
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'maladie',
        'accident_travail',
        'evenement_familial',
        'autre'
      ),
      allowNull: false,
    },
    justified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    justificationFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'Absence',
    tableName: 'absences',
    timestamps: true,
  }
);

module.exports = Absence;
