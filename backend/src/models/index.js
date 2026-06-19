const sequelize = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const Account = require('./Account');
const JournalEntry = require('./JournalEntry');
const JournalLine = require('./JournalLine');
const Invoice = require('./Invoice');
const InvoiceLine = require('./InvoiceLine');
const Client = require('./Client');

// Associations
Company.hasMany(User, { foreignKey: 'company_id' });
User.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(JournalEntry, { foreignKey: 'company_id' });
JournalEntry.belongsTo(Company, { foreignKey: 'company_id' });

JournalEntry.hasMany(JournalLine, { foreignKey: 'journal_entry_id' });
JournalLine.belongsTo(JournalEntry, { foreignKey: 'journal_entry_id' });

Account.hasMany(JournalLine, { foreignKey: 'account_id' });
JournalLine.belongsTo(Account, { foreignKey: 'account_id' });

Account.hasMany(Account, { as: 'children', foreignKey: 'parent_id' });
Account.belongsTo(Account, { as: 'parent', foreignKey: 'parent_id' });

Company.hasMany(Invoice, { foreignKey: 'company_id' });
Invoice.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(Client, { foreignKey: 'company_id' });
Client.belongsTo(Company, { foreignKey: 'company_id' });

Client.hasMany(Invoice, { foreignKey: 'client_id' });
Invoice.belongsTo(Client, { foreignKey: 'client_id' });

Invoice.hasMany(InvoiceLine, { foreignKey: 'invoice_id' });
InvoiceLine.belongsTo(Invoice, { foreignKey: 'invoice_id' });

User.hasMany(JournalEntry, { foreignKey: 'created_by' });
JournalEntry.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });

module.exports = {
  sequelize,
  User,
  Company,
  Account,
  JournalEntry,
  JournalLine,
  Invoice,
  InvoiceLine,
  Client
};
