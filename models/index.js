const Operator = require('./operator');
const Package = require('./packages');
const SimCard = require('./sim_cards');
const Customer = require('./customer');
const Allocation = require('./allocations');

// İlişkiler

// Operator - Package
Operator.hasMany(Package, { foreignKey: 'operator_id' });
Package.belongsTo(Operator, { foreignKey: 'operator_id' });

// Package - SimCard
Package.hasMany(SimCard, { foreignKey: 'package_id' });
SimCard.belongsTo(Package, { foreignKey: 'package_id' });

// Customer - Allocation
Customer.hasMany(Allocation, { foreignKey: 'customer_id' });
Allocation.belongsTo(Customer, { foreignKey: 'customer_id' });

// SimCard - Allocation
SimCard.hasMany(Allocation, { foreignKey: 'sim_card_id' });
Allocation.belongsTo(SimCard, { foreignKey: 'sim_card_id' });

module.exports = {
  Operator,
  Package,
  SimCard,
  Customer,
  Allocation
};
