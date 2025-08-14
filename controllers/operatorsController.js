const { Operator } = require('../models');

exports.getAll = async (req, res) => { //Tüm operatörleri getirir.
  try {
    const data = await Operator.findAll();
    res.json(data); //JSON formatında istemciye (frontend) gönderiyor.
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => { //id ile getirme
  try {
    const data = await Operator.findByPk(req.params.id); //findByPk primary key (id) bulur.
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => { //yeni operatör ekler.
  try {
    const data = await Operator.create(req.body); //req.body istenen kaydı oluşturur.
    res.status(201).json(data); //başarılıysa 201
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Operator.findByPk(req.params.id); //id ile değişim yapılacak elemanu bulur.
    if (!data) return res.status(404).json({ error: 'Not found' }); //bulamazsa 404
    await data.update(req.body); //günceller
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Operator.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    await data.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
