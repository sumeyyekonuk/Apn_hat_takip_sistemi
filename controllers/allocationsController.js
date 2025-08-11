const { Allocation, SimCard, Customer } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Allocation.findAll({ include: [SimCard, Customer] });
    res.json(data);
  } catch (err) {
    console.error('getAll allocations error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Allocation.findByPk(req.params.id, { include: [SimCard, Customer] });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    console.error('getById allocation error:', err);
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
    console.error('create allocation error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id);
    if (!allocation) return res.status(404).json({ error: 'Allocation not found' });

    const today = new Date().toISOString().slice(0, 10);
    if (allocation.allocation_date < today) {
      return res.status(400).json({ error: 'Fatura kesilen dönem için geriye dönük işlem yapılamaz.' });
    }

    await allocation.update(req.body);
    res.json(allocation);
  } catch (err) {
    console.error('update allocation error:', err);
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
    console.error('remove allocation error:', err);
    res.status(500).json({ error: err.message });
  }
};

//iade deneme

exports.getReturns = async (req, res) => {
  try {
    const returnedAllocations = await Allocation.findAll({
      where: { status: 'iade' },
      include: [SimCard, Customer],
    });
    console.log('Returned Allocations:', returnedAllocations);  // Sonucu kontrol et
    if (!returnedAllocations || returnedAllocations.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(returnedAllocations);
  } catch (err) {
    console.error('getReturns allocation error:', err);
    res.status(500).json({ error: err.message });
  }
};
