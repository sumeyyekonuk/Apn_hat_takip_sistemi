// burada allocation için http isteklerini yönetecek bir router oluşturuyoruz
// allocationsController'dan fonksiyonları kullanarak CRUD işlemlerini yapacağız

const express = require('express');  // Express framework'ünü içe aktarıyoruz
const router = express.Router();  // Yeni bir router nesnesi oluşturuyoruz
const allocationsController = require('../controllers/allocationsController');  // Controller dosyasını içe aktar
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Allocations
 *   description: Hat tahsis işlemleri
 */

/**
 * @swagger
 * /api/allocations:
 *   get:
 *     summary: Tüm tahsisleri listeler
 *     tags: [Allocations]
 *     responses:
 *       200:
 *         description: Başarılı
 */

// İade alınan hatları listele (örnek: /api/allocations/returns) - :id rotasından önce olmalı
router.get('/returns', allocationsController.getReturns);

// Tüm tahsisleri listele (herkes erişebilir)
router.get('/', allocationsController.getAll);

// ID ile tahsis getir (herkes erişebilir)
router.get('/:id', allocationsController.getById);

// Yeni tahsis oluştur (sadece admin ve user rolü)
router.post('/', auth(['admin', 'user']), allocationsController.create);

// Tahsis güncelle (sadece admin ve user rolü)
router.put('/:id', auth(['admin', 'user']), allocationsController.update);

// Tahsis sil (sadece admin)
router.delete('/:id', auth(['admin']), allocationsController.remove);

module.exports = router;   // Bu router'ı dışa aktarır.
