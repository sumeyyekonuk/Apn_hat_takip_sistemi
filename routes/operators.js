
//Bu dosya bir Express Router dosyasıdır. 
// Yani belirli bir URL'ye gelen istekleri yakalayıp, onları doğru fonksiyonlara yönlendiren bir yol haritasıdır.


// /api/operators gibi URL’lere gelen istekleri yakalar.
// Eğer GET isteği gelmişse → getAllOperators fonksiyonunu çalıştırır.
// Eğer POST isteği gelmişse → createOperator fonksiyonunu çalıştırır.
// Bu fonksiyonlar da veritabanı ile ilgili işlemleri yapar (veri çekme, ekleme vs).


const express = require('express'); // Express framework'ünü yüklüyoruz
const router = express.Router(); // Yeni bir router (yönlendirici) nesnesi oluşturuyoruz
const operatorsController = require('../controllers/operatorsController'); // Operatör işlemlerini içeren controller dosyasını yüklüyoruz

// GET /api/operators — Tüm operatörleri veritabanından getir
router.get('/', operatorsController.getAllOperators); 
// Bu satır şunu der: "Kullanıcı /api/operators adresine GET isteği gönderirse, getAllOperators fonksiyonunu çalıştır."

// POST /api/operators — Yeni bir operatör ekle
router.post('/', operatorsController.createOperator); 
// Bu satır da şunu der: "Kullanıcı aynı adrese POST isteği gönderirse, createOperator fonksiyonunu çalıştır."

module.exports = router; // Bu router'ı dışa aktarıyoruz ki app.js (veya index.js) içinde kullanılabilsin