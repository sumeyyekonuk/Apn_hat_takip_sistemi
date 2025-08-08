
const Operator = require('../models/operator');

// Tüm operatörleri getir
exports.getAllOperators = async (req, res) => {
  try {
    const operators = await Operator.findAll();
    res.json(operators);
  } catch (error) {
    res.status(500).json({ error: 'Veri alınamadı' });
  }
};

// Yeni operatör ekle
exports.createOperator = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'İsim boş olamaz' });
  }

  try {
    const newOperator = await Operator.create({ name });
    res.status(201).json(newOperator);
  } catch (error) {
    res.status(500).json({ error: 'Operatör oluşturulamadı' });
  }
};
