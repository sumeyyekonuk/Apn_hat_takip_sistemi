// Modelleri içe aktar (SimCard, Package, Operator, Allocation, Customer)
// Bu modeller veritabanı tablolarını temsil ediyor ve ilişkili işlemler için kullanılıyor
const { SimCard, Package, Operator, Allocation, Customer } = require('../models');

// IPv4 adresinin geçerli olup olmadığını kontrol eden fonksiyon
//// IP adresi "x.x.x.x" formatında, her x 0-255 arasında sayıdır.
function isValidIPv4(ip) {
  if (typeof ip !== 'string') return false;  // Parametre string değilse false döner
  const parts = ip.split('.');
  if (parts.length !== 4) return false;      // Parçalar 4 değilse geçerli değil
  return parts.every(part => {
    const num = Number(part);
    // Her parça sayıya dönüştürülür ve 0-255 aralığında mı diye kontrol edilir
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

// Tüm sim kartları listeleyen fonksiyon (GET /api/sim-cards)
async function getAll(req, res) {
  try {
    // Query parametresi ile status filtreleme yapılıyor, yoksa tüm kayıtlar çekiliyor
    const statusFilter = req.query.status ? { status: req.query.status } : {};

    // SimCard kayıtlarını buluyoruz, ilişkili Package, Operator, Allocation ve Customer bilgileri de dahil
    const simCards = await SimCard.findAll({ 
      where: statusFilter,
      include: [
        {
          model: Package,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [{
            model: Operator,
            attributes: ['id', 'name']
          }]
        },
        {
          model: Allocation,
          attributes: ['id', 'allocation_date', 'status', 'customer_id'],
          include: [{
            model: Customer,
            attributes: ['id', 'company_name', 'contact_person', 'phone']
          }]
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.json(simCards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Tek bir sim kartı ID ile getiren fonksiyon (GET /api/sim-cards/:id)
async function getById(req, res) {
  try {
    const simCard = await SimCard.findByPk(req.params.id, { 
      include: [
        {
          model: Package,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [{
            model: Operator,
            attributes: ['id', 'name']
          }]
        },
        {
          model: Allocation,
          attributes: ['id', 'allocation_date', 'status', 'customer_id'],
          include: [{
            model: Customer,
            attributes: ['id', 'company_name', 'contact_person', 'phone']
          }]
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!simCard) 
      return res.status(404).json({ error: 'Sim kart bulunamadı' });

    res.json(simCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Yeni sim kart ekleyen fonksiyon (POST /api/sim-cards)
async function create(req, res) {
  try {
    const { phone_number, ip_address, status } = req.body;

    // Telefon numarası validasyonu
    if (!phone_number || !/^05\d{8}$/.test(phone_number)) {
      return res.status(400).json({ error: 'Telefon numarası 10 haneli ve 05 ile başlamalıdır.' });
    }

    // IP adresi varsa geçerli IPv4 olup olmadığını kontrol et
    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' });
    }

    // Yeni sim kart oluştur
    const newSimCard = await SimCard.create({
      ...req.body,
      status: status || 'stok',
    });

    res.status(201).json(newSimCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Var olan sim kartı güncelleyen fonksiyon (PUT /api/sim-cards/:id)
async function update(req, res) {
  try {
    const { phone_number, ip_address } = req.body;

    if (phone_number && !/^05\d{8}$/.test(phone_number)) {
      return res.status(400).json({ error: 'Telefon numarası 10 haneli ve 05 ile başlamalıdır.' });
    }

    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' });
    }

    const simCard = await SimCard.findByPk(req.params.id);
    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' });

    await simCard.update(req.body);

    res.json(simCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Sim kartı silen fonksiyon (DELETE /api/sim-cards/:id)
async function remove(req, res) {
  try {
    const simCard = await SimCard.findByPk(req.params.id);
    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' });

    await simCard.destroy();

    res.json({ message: 'Sim kart silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
