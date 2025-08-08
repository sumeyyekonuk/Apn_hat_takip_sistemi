const { SimCard, Package } = require('../models');

function isValidIPv4(ip) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split('.').every(num => +num >= 0 && +num <= 255);
}

exports.getAll = async (req, res) => {
  try {
    const simCards = await SimCard.findAll({ include: Package });
    res.json(simCards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const simCard = await SimCard.findByPk(req.params.id, { include: Package });
    if (!simCard) return res.status(404).json({ error: 'Sim card not found' });
    res.json(simCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { phone_number, ip_address } = req.body;
    // Telefon numarası validasyonu
    if (!phone_number || !/^05\d{8}$/.test(phone_number)) {
      return res.status(400).json({ error: 'Telefon numarası 10 haneli ve 05 ile başlamalıdır.' });
    }
    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' });
    }
    const simCard = await SimCard.create(req.body);
    res.status(201).json(simCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { phone_number, ip_address } = req.body;
    if (phone_number && !/^05\d{8}$/.test(phone_number)) {
      return res.status(400).json({ error: 'Telefon numarası 10 haneli ve 05 ile başlamalıdır.' });
    }
    if (ip_address && !isValidIPv4(ip_address)) {
      return res.status(400).json({ error: 'Geçerli bir IPv4 adresi giriniz.' });
    }
    const simCard = await SimCard.findByPk(req.params.id);
    if (!simCard) return res.status(404).json({ error: 'Sim card not found' });
    await simCard.update(req.body);
    res.json(simCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const simCard = await SimCard.findByPk(req.params.id);
    if (!simCard) return res.status(404).json({ error: 'Sim card not found' });
    await simCard.destroy();
    res.json({ message: 'Sim card deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



