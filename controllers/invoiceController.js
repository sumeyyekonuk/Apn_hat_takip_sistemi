// invoiceController.js

const { Invoice, Allocation, Customer, SimCard, Package, sequelize } = require('../models');
const { Op } = require('sequelize');

// --- Tüm faturaları getir ---
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [Allocation, Customer, SimCard, Package]
    });
    res.json(invoices);
  } catch (err) {
    console.error('getAllInvoices error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- ID ile fatura getir ---
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [Allocation, Customer, SimCard, Package]
    });
    if (!invoice) return res.status(404).json({ error: 'Fatura bulunamadı' });
    res.json(invoice);
  } catch (err) {
    console.error('getInvoiceById error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- Fatura oluştur (tek tahsis için) ---
exports.createInvoice = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { allocation_id, period_start, period_end } = req.body;

    const allocation = await Allocation.findByPk(allocation_id, { include: [SimCard] });
    if (!allocation) return res.status(404).json({ error: 'Tahsis bulunamadı' });

    const simCard = allocation.SimCard;
    if (!simCard) return res.status(400).json({ error: 'Sim kart bilgisi eksik' });

    const packageData = await Package.findByPk(simCard.package_id);
    if (!packageData) return res.status(400).json({ error: 'Package bilgisi eksik' });

    const amount = allocation.billing_type === 'yillik'
      ? packageData.yearly_price
      : packageData.monthly_price;

    const invoice = await Invoice.create({
      allocation_id,
      customer_id: allocation.customer_id,
      sim_card_id: allocation.sim_card_id,
      package_id: simCard.package_id,
      amount,
      billing_type: allocation.billing_type,
      invoice_date: allocation.start_date,
      period_start,
      period_end,
      status: 'beklemede'
    }, { transaction: t });

    await t.commit();
    res.status(201).json(invoice);

  } catch (err) {
    await t.rollback();
    console.error('createInvoice error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- Tüm tahsisler için geçmişten bugüne tüm faturaları oluştur ---
exports.createInvoicesForAllAllocations = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const allocations = await Allocation.findAll({ include: [SimCard] });
    const createdInvoices = [];
    const today = new Date();

    for (const allocation of allocations) {
      const simCard = allocation.SimCard;
      if (!simCard) continue;

      const packageData = await Package.findByPk(simCard.package_id);
      if (!packageData) continue;

      const amount = allocation.billing_type === 'yillik'
        ? packageData.yearly_price
        : packageData.monthly_price;

      let periodStart = new Date(allocation.start_date);

      while (periodStart <= today) {
        // Fatura dönemi
        let periodEnd;
        if (allocation.billing_type === 'aylik') {
          periodEnd = new Date(periodStart);
          periodEnd.setMonth(periodEnd.getMonth() + 1);
          periodEnd.setDate(periodEnd.getDate() - 1);
        } else { // yıllık
          periodEnd = new Date(periodStart.getFullYear(), 11, 31);
        }

        // Aynı döneme ait fatura var mı kontrol et (YYYY-MM-DD string)
        const existingInvoice = await Invoice.findOne({
          where: {
            allocation_id: allocation.id,
            period_start: periodStart.toISOString().split('T')[0]
          }
        });

        if (!existingInvoice) {
          const invoice = await Invoice.create({
            allocation_id: allocation.id,
            customer_id: allocation.customer_id,
            sim_card_id: allocation.sim_card_id,
            package_id: simCard.package_id,
            amount,
            billing_type: allocation.billing_type,
            invoice_date: allocation.start_date,
            period_start,
            period_end,
            status: 'beklemede'
          }, { transaction: t });

          createdInvoices.push(invoice);
        }

        // Sonraki döneme geç
        if (allocation.billing_type === 'aylik') {
          periodStart.setMonth(periodStart.getMonth() + 1);
        } else { // yıllık
          periodStart.setFullYear(periodStart.getFullYear() + 1);
        }
      }
    }

    await t.commit();
    res.status(201).json({ message: "Toplu fatura oluşturuldu", createdInvoices });

  } catch (err) {
    await t.rollback();
    console.error('createInvoicesForAllAllocations error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};

// --- Faturayı ödeme olarak işaretle ---
exports.payInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Fatura bulunamadı' });

    invoice.status = 'odendi';
    await invoice.save();

    res.json({ message: 'Fatura ödendi', invoice });
  } catch (err) {
    console.error('payInvoice error:', err);
    res.status(500).json({ error: 'Sunucuda hata oluştu' });
  }
};
