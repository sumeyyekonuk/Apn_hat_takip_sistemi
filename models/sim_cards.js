const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Package = require('./packages'); // Package modelini import et

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
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

// İlişki: SimCard bir Package’a ait
SimCard.belongsTo(Package, { foreignKey: 'package_id' });

module.exports = SimCard;
