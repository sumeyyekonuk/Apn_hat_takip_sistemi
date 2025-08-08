const { SimCard, Allocation, Customer } = require('../models');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

// Aktif hat sayısı
exports.activeSimCardCount = async (req, res) => {
  try {
    const count = await SimCard.count({ where: { status: 'aktif' } });
    res.json({ aktifHatSayisi: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Operatör bazlı hat dağılımı
exports.operatorDistribution = async (req, res) => {
  try {
    const data = await SimCard.findAll({
      attributes: ['operator_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['operator_id']
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Müşteri bazlı tahsis edilen hatlar
exports.customerAllocations = async (req, res) => {
  try {
    const data = await Allocation.findAll({
      include: [{ model: Customer, attributes: ['company_name'] }]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tarih aralığına göre tahsis sorgulama
exports.allocationsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await Allocation.findAll({
      where: {
        allocation_date: {
          [Op.between]: [start, end]
        }
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};