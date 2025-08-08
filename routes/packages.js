
const express = require('express');
const router = express.Router();
const packagesController = require('../controllers/packagesController');

router.get('/', packagesController.getAll);
router.get('/:id', packagesController.getById);
router.post('/', packagesController.create);
router.put('/:id', packagesController.update);
router.delete('/:id', packagesController.remove);

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Hat paket işlemleri
 */

/**
 * @swagger
 * /api/packages:
 *   get:
 *     summary: Tüm paketleri listeler
 *     tags: [Packages]
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/', packagesController.getAll);

router.get('/:id', packagesController.getById);
router.post('/', packagesController.create);
router.put('/:id', packagesController.update);
router.delete('/:id', packagesController.remove);

module.exports = router;