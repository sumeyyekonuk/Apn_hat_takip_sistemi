// models/index.js
const Operator = require('./operator');
const Package = require('./packages');
const SimCard = require('./sim_cards');
const Customer = require('./customer');
const Allocation = require('./allocations');
const User = require('./user');

// Model ilişkileri
Operator.hasMany(Package, { foreignKey: 'operator_id' });
Package.belongsTo(Operator, { foreignKey: 'operator_id' });

Package.hasMany(SimCard, { foreignKey: 'package_id' });
SimCard.belongsTo(Package, { foreignKey: 'package_id' });

Customer.hasMany(Allocation, { foreignKey: 'customer_id' });
Allocation.belongsTo(Customer, { foreignKey: 'customer_id' });

SimCard.hasMany(Allocation, { foreignKey: 'sim_card_id' });
Allocation.belongsTo(SimCard, { foreignKey: 'sim_card_id' });

// Tek module.exports olarak tüm modelleri dışa aktar
module.exports = {
  Operator,
  Package,
  SimCard,
  Customer,
  Allocation,
  User
};
// models/index.js