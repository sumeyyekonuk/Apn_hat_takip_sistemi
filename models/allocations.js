const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Allocation = sequelize.define('Allocation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sim_card_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  allocation_date: {
    type: DataTypes.DATEONLY,
  },
  billing_type: {
    type: DataTypes.ENUM('aylik', 'yillik'),
  },
  installation_location: {
    type: DataTypes.TEXT,
  },
  installation_notes: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('aktif', 'iade', 'iptal'),
    defaultValue: 'aktif',
  },
}, {
  tableName: 'allocations',
  timestamps: true,
});

module.exports = Allocation;
