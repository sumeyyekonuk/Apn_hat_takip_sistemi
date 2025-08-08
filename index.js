// Express.js kullanarak API sunucusunu başlatır ve MySQL veritabanına Sequelize ile bağlanır.
//  Veritabanı bağlantısı başarılıysa, /api/operators yolundaki operatör işlemlerini yöneten route dosyasını aktif eder. 
// Sunucuyu belirlenen portta dinlemeye başlatır. Bağlantı başarısız olursa hata mesajı verir ve uygulamayı kapatır.

const express = require('express'); // Express framework'ünü dahil ediyoruz (web sunucusu)
const cors = require('cors');       // CORS middleware'i (başka domainlerden gelen istekleri kontrol eder)
const sequelize = require('./config/database'); // Daha önce oluşturduğun Sequelize veritabanı bağlantısı
const app = express();              // Express uygulaması oluşturuyoruz
const PORT = process.env.PORT || 5000; // Çalışacak port numarası, varsa ortam değişkeninden al, yoksa 5000 kullan

// Middleware: CORS ayarlarını aktif et
app.use(cors());

// Middleware: Gelen JSON formatındaki isteklerin gövdesini (body) parse et
app.use(express.json());

// Ana sayfa GET isteği (örneğin http://localhost:5000/ geldiğinde)
app.get('/', (req, res) => {
  res.send('APN Hat Takip API çalışıyor'); // Basit bir cevap dön
});

// Veritabanı bağlantısını test et (authenticate() gerçek bağlantıyı dener)
sequelize.authenticate()
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı');

    // Veritabanı bağlantısı başarılı olunca, route dosyasını dahil et
    const operatorsRoute = require('./routes/operators');

    // /api/operators altındaki tüm istekleri operatorsRoute router'ına yönlendir
    app.use('/api/operators', operatorsRoute);

    // Sunucuyu belirtilen portta başlat
    app.listen(PORT, () => {
      console.log('Server ${PORT} portunda çalışıyor');
    });
  })
  .catch(err => {
    // Bağlantı hatası varsa hata mesajı yazdır ve uygulamayı kapat
    console.error('Veritabanı bağlantı hatası:', err);
    process.exit(1);
  });

const simCardsRoute = require('./routes/sim_cards');
app.use('/api/sim-cards', simCardsRoute);

const packagesRoute = require('./routes/packages');
const customersRoute = require('./routes/customers');
const allocationsRoute = require('./routes/allocations');

app.use('/api/packages', packagesRoute);
app.use('/api/customers', customersRoute);
app.use('/api/allocations', allocationsRoute);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const reportsRoute = require('./routes/reports');
app.use('/api/reports', reportsRoute);