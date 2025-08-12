// Express modülünü projeye dahil ediyoruz
const express = require('express');

// Express Router nesnesini oluşturuyoruz
const router = express.Router();

// Raporlama işlemlerini yönetecek controller dosyasını dahil ediyoruz
const reportsController = require('../controllers/reportsController');

// Kimlik doğrulama ve yetkilendirme kontrolü yapan middleware'i dahil ediyoruz
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Raporlama işlemleri
 * 
 * Swagger dokümantasyonunda "Reports" adında bir grup (tag) tanımlanıyor.
 * Bu grup altında raporlama ile ilgili tüm endpoint'ler listelenecek.
 */

// 📌 1. Aktif hat sayısını döndürür
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
router.get(
  '/active-sim-count',                     // API endpoint URL'si
  auth(['admin', 'user']),                  // Sadece admin ve user yetkisine sahip kullanıcılar erişebilir
  reportsController.activeSimCardCount      // İstek geldiğinde çalışacak controller fonksiyonu
);

// 📌 2. Operatör bazlı hat dağılımı raporu
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
router.get(
  '/operator-distribution',
  auth(['admin', 'user']),
  reportsController.operatorDistribution
);

// 📌 3. Müşteri bazlı tahsisat raporu
/**
 * @swagger
 * /api/reports/customer-allocations:
 *   get:
 *     summary: Müşteri bazlı tahsisat raporu
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get(
  '/customer-allocations',
  auth(['admin', 'user']),
  reportsController.customerAllocations
);

// 📌 4. Tarihe göre tahsisat raporu
/**
 * @swagger
 * /api/reports/allocations-by-date:
 *   get:
 *     summary: Tarihe göre tahsisat raporu
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get(
  '/allocations-by-date',
  auth(['admin', 'user']),
  reportsController.allocationsByDate
);

// 📌 Router'ı dışa aktarıyoruz ki app.js veya index.js gibi ana dosyada kullanılabilsin
module.exports = router;



// Bu dosya, raporlama ile ilgili API endpoint'lerini tanımlar. 
// Her endpoint için ilgili controller fonksiyonunu ve yetki kontrolünü (auth middleware) belirtir. 
// Swagger yorumları, otomatik API dokümantasyonu oluşturmak için kullanılır.
