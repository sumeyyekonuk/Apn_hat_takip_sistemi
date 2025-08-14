// reportsController.js
const { SimCard, Allocation, Customer, Package, Operator } = require('../models');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

// 1. Aktif sim kart sayısı
exports.activeSimCardCount = async (req, res) => {
  try {
    const count = await SimCard.count({ where: { status: 'aktif' } });
    res.json({ aktifHatSayisi: count });
  } catch (err) {
    console.error('Active sim card count error:', err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
};

// 2. Operatör bazlı sim kart dağılımı
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

    if (!data || data.length === 0) return res.json([]);

    const result = data.map(item => ({
      operator: item.operatorName || 'Bilinmeyen',
      count: parseInt(item.count) || 0
    }));

    res.json(result);
  } catch (err) {
    console.error('Operator distribution error:', err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
};

// 2b. Allocation tablosundan operatör dağılımı (pasta grafiği için)
exports.operatorDistributionFromAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.findAll({
      include: [
        { model: Operator, attributes: ['name'], required: false } // Operator boş olsa da query çalışır
      ]
    });

    if (!allocations || allocations.length === 0) return res.json([]);

    const distribution = allocations.reduce((acc, a) => {
      const opName = a.Operator?.name || 'Bilinmeyen';
      acc[opName] = (acc[opName] || 0) + 1;
      return acc;
    }, {});

    const result = Object.entries(distribution).map(([operator, count]) => ({ operator, count }));
    res.json(result);

  } catch (err) {
    console.error('Operator distribution from allocations error:', err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
};

// 3. Müşteri tahsisleri
exports.customerAllocations = async (req, res) => {
  try {
    const data = await Allocation.findAll({
      include: [
        { model: Customer, attributes: ['company_name'] },
        { model: SimCard, attributes: ['phone_number'] }
      ]
    });
    if (!data || data.length === 0) return res.json([]);
    res.json(data);
  } catch (err) {
    console.error('Customer allocations error:', err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
};

// 4. Tarih aralığı tahsisleri
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
    if (!data || data.length === 0) return res.json([]);
    res.json(data);
  } catch (err) {
    console.error('Allocations by date error:', err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
};
