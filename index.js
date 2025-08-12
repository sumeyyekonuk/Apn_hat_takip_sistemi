// Ana uygulama dosyası (app.js veya server.js gibi)

// .env dosyasından ortam değişkenlerini yükle
require('dotenv').config();

// Gerekli modülleri çağır
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000; // Port numarası .env'den veya 5000 olarak ayarlanır
const JWT_SECRET = process.env.JWT_SECRET || 'GizliAnahtar'; // JWT gizli anahtarı

app.use(cors());           // CORS (cross-origin) ayarı
app.use(express.json());   // Gelen JSON isteklerini otomatik parse et

// Ana sayfa endpoint'i
app.get('/', (req, res) => {
  res.send('APN Hat Takip API çalışıyor');
});

// Basit demo kullanıcı (gerçek projede veritabanı kullanılmalı)
const demoUser = { username: 'admin', password: '1234' };

// Giriş (login) endpoint'i
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Kullanıcı adı veya şifre eksikse hata döndür
    if (!username || !password) return res.status(400).json({ message: 'Eksik alan' });

    // Demo kullanıcı kontrolü
    if (username === demoUser.username && password === demoUser.password) {
      // Kullanıcı doğruysa JWT token oluştur
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' }); 
      return res.json({ token }); // Token'ı döndür
    }

    // Hatalı kullanıcı adı veya şifre
    return res.status(401).json({ message: 'Kullanıcı adı veya şifre yanlış' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// JWT token doğrulama middleware'i
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];       // Authorization header al
  const token = authHeader && authHeader.split(' ')[1];  // "Bearer TOKEN" kısmından token al
  if (!token) return res.status(401).json({ message: 'Token yok' }); // Token yoksa 401 dön

  // Token doğrula
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token geçersiz' }); // Geçersiz token
    req.user = user; // Token içindeki kullanıcı bilgilerini req'ye ekle
    next();          // Middleware zincirine devam et
  });
}

// Korunan örnek route (token gerekli)
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hoş geldin ${req.user.username}` });
});

// Route dosyalarını yükle ve path ayarla
const operatorsRoute = require('./routes/operators');
const simCardsRoute = require('./routes/sim_cards');
const packagesRoute = require('./routes/packages');
const customersRoute = require('./routes/customers');
const allocationRoute = require('./routes/allocation'); // tekil dosya
const authRoutes = require('./routes/auth');
const reportsRoute = require('./routes/reports');

app.use('/api/operators', operatorsRoute);
app.use('/api/sim-cards', simCardsRoute);
app.use('/api/packages', packagesRoute);
app.use('/api/customers', customersRoute);
app.use('/api/allocations', allocationRoute);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoute);

// Swagger dokümantasyon için ayar
const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Veritabanı bağlantısını kontrol et ve server'ı başlat
sequelize.authenticate()
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı');
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch(err => {
    console.error('Veritabanı bağlantı hatası:', err);
    process.exit(1); // Bağlantı kurulamazsa uygulamayı kapat
  });

// Bu dosya, APN Hat Takip Sistemi için Express tabanlı bir backend sunucu uygulamasıdır.
//JWT ile kimlik doğrulama, MySQL (Sequelize) veritabanı bağlantısı, çeşitli API rotaları (operator, sim-card, package, customer, allocation, auth, reports) ve Swagger dokümantasyonu içerir.
//Ayrıca cors, dotenv gibi temel güvenlik ve yapılandırma ayarları yapılmıştır