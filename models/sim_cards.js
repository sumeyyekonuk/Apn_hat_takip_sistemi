const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Operator = require('./operator'); // Operator modeli import edildi

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
  operator_id: {              // Yeni alan eklendi
    type: DataTypes.INTEGER,
    allowNull: true,
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
  is_reallocated: {           
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'sim_cards',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

// SimCard ile Operator ilişkisi
SimCard.belongsTo(Operator, { foreignKey: 'operator_id' });

module.exports = SimCard;
