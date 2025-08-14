//Bu dosya Express Router kullanarak, /api/operators adresine gelen HTTP isteklerini yakalıyor.
// Uygun fonksiyonlara yönlendiriyor.

const express = require('express'); //express modulünü çağırdık
const router = express.Router(); //Router nesnesi oluşturduk
const operatorsController = require('../controllers/operatorsController');//operatorsController dosyasındaki fonksiyonları kullanır.

router.get('/', operatorsController.getAll); //get isteği atınca controllerdaki getAll fonku çalışır.
router.post('/', operatorsController.create);
router.get('/:id', operatorsController.getById);
router.put('/:id', operatorsController.update);
router.delete('/:id', operatorsController.remove);

module.exports = router;
