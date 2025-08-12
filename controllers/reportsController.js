// Raporlama için çeşitli verileri veritabanından çeken controller fonksiyonları

const { SimCard, Allocation, Customer } = require('../models');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

// 1. Aktif durumda olan sim kartların sayısını döner
exports.activeSimCardCount = async (req, res) => {
  try {
    const count = await SimCard.count({ where: { status: 'aktif' } });
    res.json({ aktifHatSayisi: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Operatörlere göre sim kartların sayısını gruplayarak döner
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

// 3. Müşterilere tahsis edilmiş sim kartların listesini, müşteri şirket adıyla birlikte döner
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

// 4. Belirtilen tarih aralığında yapılmış tahsisatları döner
exports.allocationsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;  // Tarih aralığı query parametre olarak alınır
    const data = await Allocation.findAll({
      where: {
        allocation_date: {
          [Op.between]: [start, end]  // Tarih aralığında filtreleme
        }
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
