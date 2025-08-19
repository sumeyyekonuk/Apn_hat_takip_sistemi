const express = require('express');
const router = express.Router();
const allocationsController = require('../controllers/allocationsController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Allocations
 *   description: Hat tahsis işlemleri
 */

// --- İade edilmiş tahsisleri listele ---
router.get('/returns', allocationsController.getReturns);

// --- Tüm tahsisleri listele ---
router.get('/', allocationsController.getAll);

// --- ID ile tahsis getir ---
router.get('/:id', allocationsController.getById);

// --- Yeni tahsis oluştur (admin ve user) ---
router.post('/', auth(['admin', 'user']), allocationsController.create);

// --- Tahsis güncelle (admin ve user) ---
router.put('/:id', auth(['admin', 'user']), allocationsController.update);

// --- Tahsis sil (sadece admin) ---
router.delete('/:id', auth(['admin']), allocationsController.remove);

// --- Tahsis iade et (admin ve user) ---
router.post('/return', auth(['admin', 'user']), (req, res, next) => {
  console.log('RETURN ROUTE HIT'); // <-- Post isteği terminale loglanacak
  next();
}, allocationsController.returnAllocation);

module.exports = router;
