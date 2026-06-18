const sequelize = require('../config/database');
const Employee = require('./Employee');
const LeaveRequest = require('./LeaveRequest');
const Absence = require('./Absence');
const PaySlip = require('./PaySlip');
const LeaveBalance = require('./LeaveBalance');

// Associations
Employee.hasMany(LeaveRequest, { foreignKey: 'employeeId', as: 'leaveRequests' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

Employee.hasMany(Absence, { foreignKey: 'employeeId', as: 'absences' });
Absence.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

Employee.hasMany(PaySlip, { foreignKey: 'employeeId', as: 'paySlips' });
PaySlip.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

Employee.hasMany(LeaveBalance, { foreignKey: 'employeeId', as: 'leaveBalances' });
LeaveBalance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

module.exports = {
  sequelize,
  Employee,
  LeaveRequest,
  Absence,
  PaySlip,
  LeaveBalance,
};
