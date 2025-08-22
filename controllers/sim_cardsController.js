const { SimCard, Package, Operator } = require('../models');

function isValidIPv4(ip) {
  if (typeof ip !== 'string') return false;
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = Number(part);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

const VALID_STATUS = ['stok', 'aktif', 'iptal', 'iade'];

// --- Tüm sim kartları getir ---
async function getAll(req, res) {
  try {
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    const simCards = await SimCard.findAll({
      where: statusFilter,
      include: [
        { model: Package, attributes: { exclude: ['createdAt','updatedAt'] } },
        { model: Operator, attributes: ['id','name'] }
      ],
      attributes: { exclude: ['createdAt','updatedAt'] }
    });
    res.json(simCards);
  } catch (err) {
    console.error('getAll simCards error:', err);
    res.status(500).json({ error: err.message });
  }
}

// --- ID ile sim kart getir ---
async function getById(req, res) {
  try {
    const simCard = await SimCard.findByPk(req.params.id, {
      include: [
        { model: Package, attributes: { exclude: ['createdAt','updatedAt'] } },
        { model: Operator, attributes: ['id','name'] }
      ],
      attributes: { exclude: ['createdAt','updatedAt'] }
    });

    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' });

    res.json(simCard);
  } catch (err) {
    console.error('getById simCard error:', err);
    res.status(500).json({ error: err.message });
  }
}

// --- Yeni sim kart oluştur ---
async function create(req, res) {
  try {
    const { phone_number, package_id, operator_id, ip_address, has_static_ip, status, purchase_date, capacity, price } = req.body;

    if (!phone_number || !package_id || !operator_id) {
      return res.status(400).json({ error: 'Telefon, Package ve Operator zorunludur.' });
    }

    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' });
    }

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: 'Geçersiz status değeri.' });
    }

    const newSimCard = await SimCard.create({
      phone_number,
      package_id: Number(package_id),
      operator_id: Number(operator_id),
      ip_address: ip_address || null,
      has_static_ip: has_static_ip || false,
      status: status || 'stok',
      purchase_date: purchase_date || null,
      capacity: capacity || null,
      price: price || null
    });

    // Operatör bilgisi ile dön
    const simWithOperator = await SimCard.findByPk(newSimCard.id, {
      include: [
        { model: Package, attributes: { exclude: ['createdAt','updatedAt'] } },
        { model: Operator, attributes: ['id','name'] }
      ],
      attributes: { exclude: ['createdAt','updatedAt'] }
    });

    res.status(201).json(simWithOperator);
  } catch (err) {
    console.error('create simCard error:', err);
    res.status(400).json({ error: err.message });
  }
}

// --- Sim kart güncelle ---
async function update(req, res) {
  try {
    const { phone_number, package_id, operator_id, ip_address, has_static_ip, status, purchase_date, capacity, price } = req.body;

    const simCard = await SimCard.findByPk(req.params.id);
    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' });

    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' });
    }

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: 'Geçersiz status değeri.' });
    }

    await simCard.update({
      phone_number: phone_number || simCard.phone_number,
      package_id: package_id ? Number(package_id) : simCard.package_id,
      operator_id: operator_id ? Number(operator_id) : simCard.operator_id,
      ip_address: ip_address || simCard.ip_address,
      has_static_ip: has_static_ip ?? simCard.has_static_ip,
      status: status || simCard.status,
      purchase_date: purchase_date || simCard.purchase_date,
      capacity: capacity || simCard.capacity,
      price: price || simCard.price
    });

    // Operatör bilgisi ile dön
    const simWithOperator = await SimCard.findByPk(simCard.id, {
      include: [
        { model: Package, attributes: { exclude: ['createdAt','updatedAt'] } },
        { model: Operator, attributes: ['id','name'] }
      ],
      attributes: { exclude: ['createdAt','updatedAt'] }
    });

    res.json(simWithOperator);
  } catch (err) {
    console.error('update simCard error:', err);
    res.status(400).json({ error: err.message });
  }
}

// --- Sim kart sil ---
async function remove(req, res) {
  try {
    const simCard = await SimCard.findByPk(req.params.id);
    if (!simCard) return res.status(404).json({ error: 'Sim kart bulunamadı' });

    await simCard.destroy();
    res.json({ message: 'Sim kart silindi' });
  } catch (err) {
    console.error('remove simCard error:', err);
    res.status(500).json({ error: err.message });
  }
}

// --- Toplu sim kart oluştur ---
async function bulkCreate(req, res) {
  try {
    const { simCards } = req.body;
    if (!Array.isArray(simCards) || simCards.length === 0) {
      return res.status(400).json({ error: 'Geçerli bir SIM kart listesi gönderin.' });
    }

    const results = [];
    for (let i = 0; i < simCards.length; i++) {
      const row = simCards[i];
      try {
        const { phone_number, package_id, operator_id, ip_address, has_static_ip, status, purchase_date, capacity, price } = row;

        if (!phone_number || !package_id || !operator_id) throw new Error(`Satır ${i + 1}: Telefon, Package ve Operator zorunludur.`);
        if (ip_address && !isValidIPv4(ip_address)) throw new Error(`Satır ${i + 1}: Geçersiz IP`);
        if (status && !VALID_STATUS.includes(status)) throw new Error(`Satır ${i + 1}: Geçersiz status`);

        const newSim = await SimCard.create({
          phone_number,
          package_id: Number(package_id),
          operator_id: Number(operator_id),
          ip_address: ip_address || null,
          has_static_ip: has_static_ip || false,
          status: status || 'stok',
          purchase_date: purchase_date || null,
          capacity: capacity || null,
          price: price || null
        });

        const simWithOperator = await SimCard.findByPk(newSim.id, {
          include: [
            { model: Package, attributes: { exclude: ['createdAt','updatedAt'] } },
            { model: Operator, attributes: ['id','name'] }
          ],
          attributes: { exclude: ['createdAt','updatedAt'] }
        });

        results.push(simWithOperator);
      } catch (err) {
        results.push({ error: err.message, row });
      }
    }

    res.json(results);
  } catch (err) {
    console.error('bulkCreate simCard error:', err);
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
