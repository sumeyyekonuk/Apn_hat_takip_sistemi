// routes/reports.js

const express = require('express');
const router = express.Router();

// Controller ve modeller
const reportsController = require('../controllers/reportsController');
const auth = require('../middleware/auth');
const { Allocation, Operator, Sequelize } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Raporlama işlemleri
 */

// 📌 1. Aktif hat sayısını döndürür
router.get(
  '/active-sim-count',
  auth(['admin', 'user']),
  reportsController.activeSimCardCount
);

// 📌 2. SimCard üzerinden operatör bazlı hat dağılımı
router.get(
  '/operator-distribution',
  auth(['admin', 'user']),
  reportsController.operatorDistribution
);

// 📌 2b. Allocations tablosundan operatör bazlı dağılım
router.get(
  '/operator-distribution-from-allocations',
  auth(['admin', 'user']),
  async (req, res) => {
    try {
      // Düzeltilmiş ve güvenli sürüm
      const allocations = await Allocation.findAll({
        include: [
          {
            model: Operator,
            attributes: ['name'],
            required: false // Operator boş olsa da query çalışır
          }
        ]
      });

      if (!allocations || allocations.length === 0) return res.json([]);

      // Operatör bazlı dağılımı oluştur
      const distribution = allocations.reduce((acc, a) => {
        const opName = a.Operator?.name || 'Bilinmeyen';
        acc[opName] = (acc[opName] || 0) + 1;
        return acc;
      }, {});

      const result = Object.entries(distribution).map(([operator, count]) => ({
        operator,
        count
      }));

      res.json(result);
    } catch (error) {
      console.error('Operator distribution from allocations error:', error);
      res.status(500).json({ message: 'Sunucuda hata oluştu', error: error.message });
    }
  }
);

// 📌 3. Müşteri bazlı tahsisat raporu
router.get(
  '/customer-allocations',
  auth(['admin', 'user']),
  reportsController.customerAllocations
);

// 📌 4. Tarihe göre tahsisat raporu
router.get(
  '/allocations-by-date',
  auth(['admin', 'user']),
  reportsController.allocationsByDate
);

// 🔹 Test endpoint: operatör dağılımını kontrol etmek için (middleware ile)
router.get(
  '/operator-distribution-test',
  auth(['admin', 'user']),
  async (req, res) => {
    try {
      await reportsController.operatorDistributionFromAllocations(
        { query: {} },
        { json: (output) => res.json(output) }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
