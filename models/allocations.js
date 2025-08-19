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
  operator_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // bazı tahsislerde boş olabilir
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
  // --- Yeni eklenen alanlar ---
  return_reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  returned_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'allocations',
  timestamps: true,
});

// İlişkileri tanımla
Allocation.associate = (models) => {
  Allocation.belongsTo(models.SimCard, { foreignKey: 'sim_card_id' });
  Allocation.belongsTo(models.Customer, { foreignKey: 'customer_id' });
};

module.exports = Allocation;
