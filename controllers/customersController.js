const { Customer } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Customer.findAll();
    res.json(data);
  } catch (err) {
    console.error("Customer GET ALL Error:", err); // ← HATA LOGLANIYOR
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Customer.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    console.error("Customer GET by ID Error:", err); // ← HATA LOGLANIYOR
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Customer.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error("Customer CREATE Error:", err); // ← HATA LOGLANIYOR
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Customer.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    await data.update(req.body);
    res.json(data);
  } catch (err) {
    console.error("Customer UPDATE Error:", err); // ← HATA LOGLANIYOR
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Customer.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    await data.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error("Customer DELETE Error:", err); // ← HATA LOGLANIYOR
    res.status(500).json({ error: err.message });
  }
};
