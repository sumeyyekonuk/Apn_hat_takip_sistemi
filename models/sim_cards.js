const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SimCard = sequelize.define('SimCard', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phone_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('stok', 'aktif', 'iptal', 'iade'),
    defaultValue: 'stok',
  },
  ip_address: {
    type: DataTypes.STRING(15),
  },
  has_static_ip: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  purchase_date: {
    type: DataTypes.DATEONLY,
  },
}, {
  tableName: 'sim_cards',
  timestamps: true,          // timestamps aktif
  createdAt: 'createdAt',    // veritabanındaki createdAt kolonuna karşılık
  updatedAt: 'updatedAt',    // veritabanındaki updatedAt kolonuna karşılık
});

module.exports = SimCard;
