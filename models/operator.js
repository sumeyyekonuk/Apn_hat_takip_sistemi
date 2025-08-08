const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Operator = sequelize.define('Operator', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'operators',
  timestamps: false,
});

module.exports = Operator;
