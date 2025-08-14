// index.js veya app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'GizliAnahtar';

app.use(cors());
app.use(express.json());

// Basit demo kullanıcı
const demoUser = { username: 'admin', password: '1234' };

// Giriş (login) endpoint
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Eksik alan' });

    if (username === demoUser.username && password === demoUser.password) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }

    return res.status(401).json({ message: 'Kullanıcı adı veya şifre yanlış' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// JWT doğrulama middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token yok' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token geçersiz' });
    req.user = user;
    next();
  });
}

// Route dosyalarını yükle
const operatorsRoute = require('./routes/operators');
const simCardsRoute = require('./routes/sim_cards');
const packagesRoute = require('./routes/packages');
const customersRoute = require('./routes/customers');
const allocationRoute = require('./routes/allocation');
const authRoutes = require('./routes/auth');
const reportsRoute = require('./routes/reports');

app.use('/api/operators', operatorsRoute);
app.use('/api/sim-cards', simCardsRoute);
app.use('/api/packages', packagesRoute);
app.use('/api/customers', customersRoute);
app.use('/api/allocations', allocationRoute);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoute);

// Swagger dokümantasyon
const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ana endpoint
app.get('/', (req, res) => {
  res.send('APN Hat Takip API çalışıyor');
});

// Güvenli başlatma
sequelize.authenticate()
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı');
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch(err => {
    console.error('Veritabanı bağlantı hatası:', err);
    process.exit(1);
  });

module.exports = app;
