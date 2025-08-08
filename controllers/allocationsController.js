const { Allocation, SimCard, Customer } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Allocation.findAll({ include: [SimCard, Customer] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Allocation.findByPk(req.params.id, { include: [SimCard, Customer] });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { sim_card_id, customer_id } = req.body;
    const exists = await Allocation.findOne({ where: { sim_card_id, customer_id, status: 'aktif' } });
    if (exists) {
      return res.status(400).json({ error: 'Bu müşteri için bu hat zaten tahsis edilmiş.' });
    }
    const allocation = await Allocation.create(req.body);
    res.status(201).json(allocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id);
    if (!allocation) return res.status(404).json({ error: 'Allocation not found' });

    // Fatura dönemi geçmişse güncelleme engellenir (örnek: allocation_date < bugün)
    const today = new Date().toISOString().slice(0, 10);
    if (allocation.allocation_date < today) {
      return res.status(400).json({ error: 'Fatura kesilen dönem için geriye dönük işlem yapılamaz.' });
    }

    await allocation.update(req.body);
    res.json(allocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Allocation.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    await data.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};