
// burada allocation için http isteklerini yönetecek bir router oluşturuyoruz
// allocationsController'dan fonksiyonları kullanarak CRUD işlemlerini yapacağız

const express = require('express');  // Express framework'ünü içe aktarıyoruz
const Allocation = require('../models/allocations');  // Allocation modelini içe aktarı
const router = express.Router();  // Yeni bir router nesnesi oluşturuyoruz Bu nesne, belirli bir kaynağa (allocations) ait HTTP isteklerini tanımlamak için kullanılır.
// Kısaca: allocation ile ilgili tüm GET, POST, PUT, DELETE işlemleri bu router'da toplanır.

const allocationsController = require('../controllers/allocationsController');  //controllers klasöründeki allocationsController.js dosyasını içe aktarır.
// Bu controller, bu rotaların çağırdığı fonksiyonları içerir.
 // Örn: getAll, getById, create, update, remove

const auth = require('../middleware/auth');

// Listeleme herkes erişebilir (örnek)
router.get('/', allocationsController.getAll);  // tüm tahsis edilen hatları listele 
router.get('/:id', allocationsController.getById);  

// Sadece admin ve user rolü erişebilir
router.post('/', auth(['admin', 'user']), allocationsController.create);   //POST /allocations
// Yeni bir tahsis (Allocation) kaydı oluşturur.
// Gelen veriler req.body içindedir.
// create fonksiyonu çalışır.
//Kullanım: "Yeni bir müşteri için hat tahsisi yap
router.put('/:id', auth(['admin', 'user']), allocationsController.update);  //PUT /allocations/5
// Mevcut bir tahsis kaydını günceller.
// Hangi tahsis güncellenecek? → :id
// Yeni bilgiler → req.body
// Kullanım: "5 numaralı tahsisin bilgilerini güncelle"

router.delete('/:id', auth(['admin']), allocationsController.remove);

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
router.get('/', allocationsController.getAll);

router.get('/:id', allocationsController.getById);
router.post('/', allocationsController.create);
router.put('/:id', allocationsController.update);
router.delete('/:id', allocationsController.remove);

module.exports = router;   // Bu router'ı dışa aktarır.
// Başka bir dosyada bu router kullanılabilir:
