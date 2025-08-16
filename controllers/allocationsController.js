const { Allocation, SimCard, Customer, Package, Operator, sequelize } = require('../models');

// --- Tüm tahsisleri getir ---
exports.getAll = async (req, res) => {
  try {
    const data = await Allocation.findAll({ include: [SimCard, Customer] });
    res.json(data);
  } catch (err) {
    console.error('getAll allocations error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- ID ile tahsis getir ---
exports.getById = async (req, res) => {
  try {
    const data = await Allocation.findByPk(req.params.id, { include: [SimCard, Customer] });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    console.error('getById allocation error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- Tahsis oluştur ---
exports.create = async (req, res) => {
  const { sim_card_id, customer_id } = req.body;
  try {
    const simCardId = Number(sim_card_id);
    let allocation, simCard;

    // Transaction başlat
    await sequelize.transaction(async (t) => {
      simCard = await SimCard.findByPk(simCardId, { transaction: t });
      if (!simCard) throw new Error('SimCard bulunamadı');

      allocation = await Allocation.create(
        { ...req.body, status: 'aktif', sim_card_id: simCardId, customer_id: Number(customer_id) },
        { transaction: t }
      );

      const [rowsUpdated] = await SimCard.update(
        { status: 'aktif' },
        { where: { id: simCardId }, transaction: t }
      );
      if (rowsUpdated === 0) throw new Error('SimCard status update başarısız');
    });

    // Transaction tamamlandıktan sonra response gönder
    res.status(201).json({ allocation, simCard });
  } catch (err) {
    console.error('create allocation error:', err);
    res.status(400).json({ error: err.message });
  }
};

// --- Tahsis güncelle ---
exports.update = async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id);
    if (!allocation) return res.status(404).json({ error: 'Allocation not found' });

    const today = new Date().toISOString().slice(0, 10);
    if (allocation.allocation_date && allocation.allocation_date < today) {
      return res.status(400).json({ error: 'Fatura kesilen dönem için geriye dönük işlem yapılamaz.' });
    }

    let updatedAllocation;
    await sequelize.transaction(async (t) => {
      await allocation.update(req.body, { transaction: t });

      const simCard = await SimCard.findByPk(allocation.sim_card_id, { transaction: t });
      if (simCard) {
        if (req.body.status === 'aktif') {
          await simCard.update({ status: 'aktif' }, { transaction: t });
        } else if (['iade', 'iptal'].includes(req.body.status)) {
          await simCard.update({ status: 'stok' }, { transaction: t });
        }
      }

      updatedAllocation = allocation;
    });

    res.json(updatedAllocation);
  } catch (err) {
    console.error('update allocation error:', err);
    res.status(400).json({ error: err.message });
  }
};

// --- Tahsis sil ---
exports.remove = async (req, res) => {
  try {
    const data = await Allocation.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });

    await sequelize.transaction(async (t) => {
      const simCard = await SimCard.findByPk(data.sim_card_id, { transaction: t });
      if (simCard && data.status === 'aktif') {
        await simCard.update({ status: 'stok' }, { transaction: t });
      }
      await data.destroy({ transaction: t });
    });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('remove allocation error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- İade edilmiş tahsisleri getir ---
exports.getReturns = async (req, res) => {
  try {
    const returnedAllocations = await Allocation.findAll({
      where: { status: 'iade' },
      include: [SimCard, Customer],
    });

    if (!returnedAllocations || returnedAllocations.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(returnedAllocations);
  } catch (err) {
    console.error('getReturns allocation error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};
