const express = require('express'); //express çağırıldı.
const router = express.Router(); //yeni router oluştu
const simCardsController = require('../controllers/sim_cardsController'); //controller dosyası çağrıldı.

/**
 * @swagger
 * tags:
 *   name: SimCards
 *   description: Sim kart işlemleri
 */

/**
 * @swagger
 * /api/sim-cards:
 *   get:
 *     summary: Tüm sim kartları listeler
 *     tags: [SimCards]
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/', simCardsController.getAll); //get isteği

/**
 * @swagger
 * /api/sim-cards/{id}:
 *   get:
 *     summary: Tek sim kart detayını getirir
 *     tags: [SimCards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Başarılı
 *       404:
 *         description: Bulunamadı
 */
router.get('/:id', simCardsController.getById);

/**
 * @swagger
 * /api/sim-cards:
 *   post:
 *     summary: Yeni sim kart ekler
 *     tags: [SimCards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number: { type: string }
 *               package_id: { type: integer }
 *               status: { type: string }
 *               ip_address: { type: string }
 *               has_static_ip: { type: boolean }
 *               purchase_date: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Oluşturuldu
 *       400:
 *         description: Hatalı istek
 */
router.post('/', simCardsController.create); //post isteği

/**
 * @swagger
 * /api/sim-cards/{id}:
 *   put:
 *     summary: Sim kartı günceller
 *     tags: [SimCards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number: { type: string }
 *               package_id: { type: integer }
 *               status: { type: string }
 *               ip_address: { type: string }
 *               has_static_ip: { type: boolean }
 *               purchase_date: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Güncellendi
 *       404:
 *         description: Bulunamadı
 */
router.put('/:id', simCardsController.update); //put isteği

/**
 * @swagger
 * /api/sim-cards/{id}:
 *   delete:
 *     summary: Sim kartı siler
 *     tags: [SimCards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Silindi
 *       404:
 *         description: Bulunamadı
 */
router.delete('/:id', simCardsController.remove); //delete isteği

module.exports = router;

/**
 * @swagger yorumları, API'nin dokümantasyonunu otomatik oluşturmak için kullanılır.
 * Bu yorumlar, endpointlerin URL'leri, hangi HTTP metodunu kullandığı,
 * parametreleri, isteğe verilen cevapları ve açıklamalarını belirtir.
 * Swagger UI gibi araçlar bu yorumları okuyarak, geliştiricilerin API'yi kolayca anlamasını sağlar.
 */



// API Endpoint: Uygulamanın veri alma, ekleme, güncelleme veya silme işlemleri için kullanılan URL yollarıdır.
// Her endpoint, belirli bir HTTP metoduyla (GET, POST, PUT, DELETE) kullanılır.
// Örnek: GET /api/sim-cards → Tüm sim kartları getirir.