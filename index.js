const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ana sayfa endpoint
app.get('/', (req, res) => {
  res.send('APN Hat Takip API çalışıyor');
});

// Route importları
const operatorsRoute = require('./routes/operators');
const simCardsRoute = require('./routes/sim_cards');
const packagesRoute = require('./routes/packages');
const customersRoute = require('./routes/customers');
const allocationRoute = require('./routes/allocation');  // Tekil dosya adına göre
const authRoutes = require('./routes/auth');
const reportsRoute = require('./routes/reports');

app.use('/api/operators', operatorsRoute);
app.use('/api/sim-cards', simCardsRoute);
app.use('/api/packages', packagesRoute);
app.use('/api/customers', customersRoute);
app.use('/api/allocations', allocationRoute);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoute);

// Swagger setup
const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Veritabanı bağlantısı ve server başlatma
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

