const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // senin db config dosyan

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  allocation_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sim_card_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  billing_type: {
    type: DataTypes.ENUM('aylik','yillik'),
    allowNull: false
  },
  invoice_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('beklemede','odendi'),
    defaultValue: 'beklemede'
  }
}, {
  tableName: 'invoices',
  timestamps: true
});

module.exports = Invoice;
