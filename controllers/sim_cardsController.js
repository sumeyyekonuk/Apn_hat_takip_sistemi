const { SimCard, Package, Operator } = require('../models');

// IP adresi doğrulama fonksiyonu
function isValidIPv4(ip) {
  if (typeof ip !== 'string') return false;
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = Number(part);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

// Enum status kontrolü
const VALID_STATUS = ['stok', 'aktif', 'iptal', 'iade'];

// --- Tüm SIM kartları getir ---
async function getAll(req, res) {
  try {
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    const simCards = await SimCard.findAll({
      where: statusFilter,
      include: [{
        model: Package,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
          model: Operator,
          attributes: ['id', 'name']
        }]
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json(simCards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// --- Tek bir SIM kart getir ---
async function getById(req, res) {
  try {
    const simCard = await SimCard.findByPk(req.params.id, {
      include: [{
        model: Package,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{ model: Operator, attributes: ['id', 'name'] }]
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' });

    res.json(simCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// --- Yeni SIM kart oluştur ---
async function create(req, res) {
  try {
    const { phone_number, package_id, ip_address, has_static_ip, status, purchase_date, capacity, price } = req.body;

    if (!phone_number || !/^05\d{8}$/.test(phone_number)) {
      return res.status(400).json({ error: 'Telefon numarası 10 haneli ve 05 ile başlamalıdır.' });
    }

    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' });
    }

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: 'Geçersiz status değeri.' });
    }

    const newSimCard = await SimCard.create({
      phone_number,
      package_id,
      ip_address: ip_address || null,
      has_static_ip: has_static_ip || false,
      status: status || 'stok',
      purchase_date: purchase_date || null,
      capacity: capacity || null,
      price: price || null
    });

    res.status(201).json(newSimCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// --- SIM kart güncelle ---
async function update(req, res) {
  try {
    const { phone_number, package_id, ip_address, has_static_ip, status, purchase_date, capacity, price } = req.body;

    if (phone_number && !/^05\d{8}$/.test(phone_number)) {
      return res.status(400).json({ error: 'Telefon numarası 10 haneli ve 05 ile başlamalıdır.' });
    }

    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' });
    }

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: 'Geçersiz status değeri.' });
    }

    const simCard = await SimCard.findByPk(req.params.id);
    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' });

    await simCard.update({
      phone_number,
      package_id,
      ip_address: ip_address || null,
      has_static_ip: has_static_ip || false,
      status: status || simCard.status,
      purchase_date: purchase_date || simCard.purchase_date,
      capacity: capacity || simCard.capacity,
      price: price || simCard.price
    });

    res.json(simCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// --- SIM kart sil ---
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

// --- Bulk CSV import ---
async function bulkCreate(req, res) {
  try {
    const { simCards } = req.body; // frontend CSV’den parse edip dizi gönderecek
    if (!Array.isArray(simCards) || simCards.length === 0) {
      return res.status(400).json({ error: 'Geçerli bir SIM kart listesi gönderin.' });
    }

    const results = [];
    for (let i = 0; i < simCards.length; i++) {
      const row = simCards[i];
      try {
        const { phone_number, package_id, ip_address, has_static_ip, status, purchase_date, capacity, price } = row;

        if (!phone_number || !/^05\d{8}$/.test(phone_number)) throw new Error(`Satır ${i + 1}: Geçersiz telefon numarası`);
        if (ip_address && !isValidIPv4(ip_address)) throw new Error(`Satır ${i + 1}: Geçersiz IP`);
        if (status && !VALID_STATUS.includes(status)) throw new Error(`Satır ${i + 1}: Geçersiz status`);

        const newSim = await SimCard.create({
          phone_number,
          package_id,
          ip_address: ip_address || null,
          has_static_ip: has_static_ip || false,
          status: status || 'stok',
          purchase_date: purchase_date || null,
          capacity: capacity || null,
          price: price || null
        });
        results.push(newSim);
      } catch (err) {
        results.push({ error: err.message, row });
      }
    }

    res.json(results);
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
  bulkCreate
};
