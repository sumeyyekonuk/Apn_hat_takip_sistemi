
const express = require('express');
const router = express.Router();
const packagesController = require('../controllers/packagesController');

router.get('/', packagesController.getAll);
router.get('/:id', packagesController.getById);
router.post('/', packagesController.create);
router.put('/:id', packagesController.update);
router.delete('/:id', packagesController.remove);

module.exports = router;