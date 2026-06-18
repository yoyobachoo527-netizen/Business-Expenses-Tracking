const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class LeaveRequest extends Model {}

LeaveRequest.init(
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
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    daysCount: {
      type: DataTypes.DECIMAL(5, 1),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
      defaultValue: 'pending',
    },
    reason: {
      type: DataTypes.TEXT,
    },
    managerComment: {
      type: DataTypes.TEXT,
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sirhReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'LeaveRequest',
    tableName: 'leave_requests',
    timestamps: true,
  }
);

module.exports = LeaveRequest;
