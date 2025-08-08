const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  type: { 
    type: DataTypes.ENUM('musteri', 'bayi'), 
    allowNull: false 
  },
  company_name: { 
    type: DataTypes.STRING(100) 
  },
  contact_person: { 
    type: DataTypes.STRING(100) 
  },
  phone: { 
    type: DataTypes.STRING(20) 
  },
  email: { 
    type: DataTypes.STRING(100) 
  },
  address: { 
    type: DataTypes.TEXT 
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, {
  tableName: 'customers',
  timestamps: false
});

module.exports = Customer;
