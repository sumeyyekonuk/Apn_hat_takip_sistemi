const { SimCard, Package, Operator } = require('../models'); // Operator modeli eklendi

function isValidIPv4(ip) {
  if (typeof ip !== 'string') return false;                // Tip kontrolü eklendi
  const parts = ip.split('.');
  if (parts.length !== 4) return false;                    // Parça sayısı kontrolü eklendi
  return parts.every(part => {
    const num = Number(part);
    return !isNaN(num) && num >= 0 && num <= 255;          // 0-255 arası sayılar kontrolü (sayısal dönüşüm daha güvenli)
  });
}

async function getAll(req, res) {
  try {
    const statusFilter = req.query.status ? { status: req.query.status } : {};  // status query parametresi eklendi

    const simCards = await SimCard.findAll({ 
      where: statusFilter, // filtre where ile uygulandı
      include: [{
        model: Package,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
          model: Operator, // Operator modeli ilişkilendirildi
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

async function getById(req, res) {
  try {
    const simCard = await SimCard.findByPk(req.params.id, { 
      include: [{
        model: Package,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
          model: Operator, // Operator modeli ilişkilendirildi
          attributes: ['id', 'name']
        }]
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' }); // hata mesajı Türkçe olarak güncellendi

    res.json(simCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const { phone_number, ip_address, status } = req.body;

    if (!phone_number || !/^05\d{8}$/.test(phone_number)) {
      return res.status(400).json({ error: 'Telefon numarası 10 haneli ve 05 ile başlamalıdır.' }); // hata mesajı Türkçe
    }

    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' }); // hata mesajı Türkçe
    }

    const newSimCard = await SimCard.create({
      ...req.body,
      status: status || 'stok', // status yoksa 'stok' varsayılan olarak atanıyor
    });

    res.status(201).json(newSimCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const { phone_number, ip_address } = req.body;

    if (phone_number && !/^05\d{8}$/.test(phone_number)) {
      return res.status(400).json({ error: 'Telefon numarası 10 haneli ve 05 ile başlamalıdır.' }); // hata mesajı Türkçe
    }

    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' }); // hata mesajı Türkçe
    }

    const simCard = await SimCard.findByPk(req.params.id);
    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' }); // hata mesajı Türkçe

    await simCard.update(req.body);
    res.json(simCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const simCard = await SimCard.findByPk(req.params.id);
    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' }); // hata mesajı Türkçe

    await simCard.destroy();
    res.json({ message: 'Sim kart silindi' }); // mesaj Türkçe
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