// models/index.js
// Tüm modeller burada toplanıyor ve aralarındaki ilişkiler tanımlanıyor.
// Böylece modeller diğer dosyalarda kolayca kullanılabiliyor.
// hasMany ve belongsTo ile tablolar arasındaki bire çok ilişkiler kuruluyor.

const Operator = require('./operator');
const Package = require('./packages');
const SimCard = require('./sim_cards');
const Customer = require('./customer');
const Allocation = require('./allocations');
const User = require('./user');

// Model ilişkileri

// Operator ↔ Package
Operator.hasMany(Package, { foreignKey: 'operator_id' });
Package.belongsTo(Operator, { foreignKey: 'operator_id' });

// Package ↔ SimCard
Package.hasMany(SimCard, { foreignKey: 'package_id' });
SimCard.belongsTo(Package, { foreignKey: 'package_id' });

// Customer ↔ Allocation
Customer.hasMany(Allocation, { foreignKey: 'customer_id' });
Allocation.belongsTo(Customer, { foreignKey: 'customer_id' });

// SimCard ↔ Allocation
SimCard.hasMany(Allocation, { foreignKey: 'sim_card_id' });
Allocation.belongsTo(SimCard, { foreignKey: 'sim_card_id' });

// Operator ↔ Allocation (yeni)
Operator.hasMany(Allocation, { foreignKey: 'operator_id' });
Allocation.belongsTo(Operator, { foreignKey: 'operator_id' });

// Tek module.exports olarak tüm modelleri dışa aktar
module.exports = {
  Operator,
  Package,
  SimCard,
  Customer,
  Allocation,
  User
};
