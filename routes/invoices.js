// routes/invoices.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// --- Tüm faturaları getir ---
router.get('/', invoiceController.getAllInvoices);

// --- ID ile fatura getir ---
router.get('/:id', invoiceController.getInvoiceById);

// --- Yeni fatura oluştur ---
router.post('/', invoiceController.createInvoice);

// --- Toplu fatura oluştur (tüm tahsisler için) ---
router.post('/create-all', invoiceController.createInvoicesForAllAllocations);

// --- Faturayı ödeme olarak işaretle ---
router.put('/:id/pay', invoiceController.payInvoice);

module.exports = router;
