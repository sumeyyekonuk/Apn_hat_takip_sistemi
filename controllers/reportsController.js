// reportsController.js
const { SimCard, Allocation, Customer, Package, Operator } = require('../models');
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

// 2. Operatörlere göre sim kartların sayısını gruplayarak döner (SimCard → Package → Operator)
exports.operatorDistribution = async (req, res) => {
  try {
    const data = await SimCard.findAll({
      attributes: [
        [sequelize.col('Package.Operator.name'), 'operatorName'],
        [sequelize.fn('COUNT', sequelize.col('SimCard.id')), 'count']
      ],
      include: [
        {
          model: Package,
          attributes: [],
          include: [
            {
              model: Operator,
              attributes: []
            }
          ]
        }
      ],
      group: ['Package.Operator.name'],
      raw: true
    });

    const result = data.map(item => ({
      operator: item.operatorName,
      count: item.count
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2b. Allocations tablosundan operatör dağılımını döner (allocations tablosuna operator_id eklendi)
exports.operatorDistributionFromAllocations = async (req, res) => {
  try {
    const data = await Allocation.findAll({
      attributes: [
        [sequelize.col('Operator.name'), 'operatorName'],
        [sequelize.fn('COUNT', sequelize.col('Allocation.id')), 'count']
      ],
      include: [
        {
          model: Operator,
          attributes: []
        }
      ],
      group: ['Operator.name'],
      raw: true
    });

    const result = data.map(item => ({
      operator: item.operatorName,
      count: item.count
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Müşterilere tahsis edilmiş sim kartların listesini, müşteri şirket adı ve hat numarasıyla birlikte döner
exports.customerAllocations = async (req, res) => {
  try {
    const data = await Allocation.findAll({
      include: [
        {
          model: Customer,
          attributes: ['company_name']
        },
        {
          model: SimCard,
          attributes: ['phone_number']
        }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Belirtilen tarih aralığında yapılmış tahsisatları döner (müşteri ve sim kart bilgileri dahil)
exports.allocationsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await Allocation.findAll({
      where: {
        allocation_date: {
          [Op.between]: [start, end]
        }
      },
      include: [
        { model: Customer, attributes: ['company_name'] },
        { model: SimCard, attributes: ['phone_number'] }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
