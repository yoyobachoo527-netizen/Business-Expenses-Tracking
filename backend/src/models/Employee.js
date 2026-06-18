const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

class Employee extends Model {
  static async findByCredentials(email, password) {
    const employee = await Employee.findOne({ where: { email, isActive: true } });
    if (!employee) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, employee.passwordHash);
    if (!isMatch) throw new Error('Invalid credentials');
    return employee;
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  }
}

Employee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    matricule: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    department: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    hireDate: {
      type: DataTypes.DATEONLY,
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
  }
);

module.exports = Employee;
