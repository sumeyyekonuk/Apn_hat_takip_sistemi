const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  operator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  data_limit: {
    type: DataTypes.STRING(20),
  },
  network_type: {
    type: DataTypes.STRING(10), // 2G, 3G, 4G, 5G gibi
  },
  monthly_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  yearly_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  tableName: 'packages',
  timestamps: false,
});

module.exports = Package;
