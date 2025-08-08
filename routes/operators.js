
//Bu dosya bir Express Router dosyasıdır. 
// Yani belirli bir URL'ye gelen istekleri yakalayıp, onları doğru fonksiyonlara yönlendiren bir yol haritasıdır.


// /api/operators gibi URL’lere gelen istekleri yakalar.
// Eğer GET isteği gelmişse → getAllOperators fonksiyonunu çalıştırır.
// Eğer POST isteği gelmişse → createOperator fonksiyonunu çalıştırır.
// Bu fonksiyonlar da veritabanı ile ilgili işlemleri yapar (veri çekme, ekleme vs).


const express = require('express');
const router = express.Router();
const operatorsController = require('../controllers/operatorsController');

router.get('/', operatorsController.getAll);
router.post('/', operatorsController.create);
router.get('/:id', operatorsController.getById);
router.put('/:id', operatorsController.update);
router.delete('/:id', operatorsController.remove);

module.exports = router;
