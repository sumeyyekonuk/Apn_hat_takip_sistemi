const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Raporlama işlemleri
 */

/**
 * @swagger
 * /api/reports/active-sim-count:
 *   get:
 *     summary: Aktif hat sayısını döndürür
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/active-sim-count', reportsController.activeSimCardCount);

/**
 * @swagger
 * /api/reports/operator-distribution:
 *   get:
 *     summary: Operatör bazlı hat dağılımı
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/operator-distribution', reportsController.operatorDistribution);

router.get('/active-sim-count', auth(['admin', 'user']), reportsController.activeSimCardCount);
router.get('/operator-distribution', auth(['admin', 'user']), reportsController.operatorDistribution);
router.get('/customer-allocations', auth(['admin', 'user']), reportsController.customerAllocations);
router.get('/allocations-by-date', auth(['admin', 'user']), reportsController.allocationsByDate);



router.get('/customer-allocations', reportsController.customerAllocations);
router.get('/allocations-by-date', reportsController.allocationsByDate);

module.exports = router;