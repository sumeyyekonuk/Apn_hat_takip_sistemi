
const express = require('express');
const router = express.Router();
const simCardsController = require('../controllers/sim_cardsController');

router.get('/', simCardsController.getAll);
router.get('/:id', simCardsController.getById);
router.post('/', simCardsController.create);
router.put('/:id', simCardsController.update);
router.delete('/:id', simCardsController.remove);

module.exports = router;