const express = require('express');
const router = express.Router();
const simCardsController = require('../controllers/sim_cardsController');

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
router.get('/', simCardsController.getAll);

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
router.post('/', simCardsController.create);

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
router.put('/:id', simCardsController.update);

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
router.delete('/:id', simCardsController.remove);

module.exports = router;
