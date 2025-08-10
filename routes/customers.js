const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customersController');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Müşteri/bayi işlemleri
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Tüm müşterileri/bayileri listeler
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/', customersController.getAll);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Tek müşteri/bayi detayını getirir
 *     tags: [Customers]
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
router.get('/:id', customersController.getById);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Yeni müşteri/bayi ekler
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string }
 *               company_name: { type: string }
 *               contact_person: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               address: { type: string }
 *     responses:
 *       201:
 *         description: Oluşturuldu
 *       400:
 *         description: Hatalı istek
 */
router.post('/', customersController.create);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Müşteri/bayi günceller
 *     tags: [Customers]
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
 *               type: { type: string }
 *               company_name: { type: string }
 *               contact_person: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               address: { type: string }
 *     responses:
 *       200:
 *         description: Güncellendi
 *       404:
 *         description: Bulunamadı
 */
router.put('/:id', customersController.update);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Müşteri/bayi siler
 *     tags: [Customers]
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
router.delete('/:id', customersController.remove);

module.exports = router;
