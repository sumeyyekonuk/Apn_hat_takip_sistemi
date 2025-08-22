const { Allocation, SimCard, Customer, sequelize } = require('../models');
const { Op } = require('sequelize');

// --- Tüm aktif tahsisleri getir ---
exports.getAll = async (req, res) => {
  try {
    const lastAllocations = await Allocation.findAll({
      include: [SimCard, Customer],
      where: {
        id: {
          [Op.in]: sequelize.literal(`(
            SELECT MAX(id)
            FROM allocations
            GROUP BY sim_card_id
          )`)
        }
      }
    });

    const activeAllocations = lastAllocations.filter(a => a.status === 'aktif');
    res.json(activeAllocations);
  } catch (err) {
    console.error('getAll allocations error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- İade edilmiş tahsisleri getir ---
exports.getReturns = async (req, res) => {
  try {
    const lastAllocations = await Allocation.findAll({
      include: [SimCard, Customer],
      where: {
        id: {
          [Op.in]: sequelize.literal(`(
            SELECT MAX(id)
            FROM allocations
            GROUP BY sim_card_id
          )`)
        }
      }
    });

    const returnAllocations = lastAllocations.filter(a => a.status === 'iade');
    res.json(returnAllocations);
  } catch (err) {
    console.error('getReturns allocation error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- ID ile tahsis getir ---
exports.getById = async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id, {
      include: [SimCard, Customer],
    });

    if (!allocation) return res.status(404).json({ error: 'Tahsis bulunamadı' });

    res.json(allocation);
  } catch (err) {
    console.error('getById error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- Yeni tahsis oluştur ---
exports.create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const allocation = await Allocation.create(req.body, { transaction: t });

    // Sim kartın operator_id ve durumunu güncelle
    const simCard = await SimCard.findByPk(req.body.sim_card_id, { transaction: t });
    if (simCard) {
      await simCard.update(
        { operator_id: req.body.operator_id, status: 'aktif' },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(201).json(allocation);
  } catch (err) {
    await t.rollback();
    console.error('create allocation error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- Tahsis güncelle ---
exports.update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const allocation = await Allocation.findByPk(req.params.id, { transaction: t });
    if (!allocation) return res.status(404).json({ error: 'Tahsis bulunamadı' });

    await allocation.update(req.body, { transaction: t });

    // Sim kartın operator_id güncelle (opsiyonel: operator değişmişse)
    if (req.body.operator_id) {
      const simCard = await SimCard.findByPk(allocation.sim_card_id, { transaction: t });
      if (simCard) {
        await simCard.update({ operator_id: req.body.operator_id }, { transaction: t });
      }
    }

    await t.commit();
    res.json(allocation);
  } catch (err) {
    await t.rollback();
    console.error('update allocation error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- Tahsis sil ---
exports.remove = async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id);
    if (!allocation) return res.status(404).json({ error: 'Tahsis bulunamadı' });

    await allocation.destroy();
    res.json({ message: 'Tahsis silindi' });
  } catch (err) {
    console.error('remove allocation error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- Tahsis iade et ---
exports.returnAllocation = async (req, res) => {
  const { allocationId, return_reason } = req.body;

  if (!return_reason)
    return res.status(400).json({ error: 'İade nedeni girilmesi zorunludur.' });

  const t = await sequelize.transaction();
  try {
    const allocation = await Allocation.findByPk(allocationId, { transaction: t });
    if (!allocation) return res.status(404).json({ error: 'Tahsis bulunamadı' });
    if (allocation.status !== 'aktif') {
      return res.status(400).json({ error: 'Sadece aktif tahsisler iade edilebilir.' });
    }

    // Allocation durumu 'iade' olarak güncelle
    await allocation.update(
      { status: 'iade', return_reason, returned_at: new Date() },
      { transaction: t }
    );

    // Sim kart durumu 'stok' ve operator_id temizlenebilir
    const simCard = await SimCard.findByPk(allocation.sim_card_id, { transaction: t });
    if (simCard) await simCard.update({ status: 'stok', operator_id: null }, { transaction: t });

    await t.commit();

    const lastAllocation = await Allocation.findOne({
      where: { sim_card_id: allocation.sim_card_id },
      include: [SimCard, Customer],
      order: [['id', 'DESC']],
    });

    res.json({ message: 'Tahsis iade edildi', allocation: lastAllocation });
  } catch (err) {
    await t.rollback();
    console.error('returnAllocation error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};
