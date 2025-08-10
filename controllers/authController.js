const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'apn_secret_key';

// Kullanıcı kaydı
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Boş alan kontrolü
    if (!username || !password) {
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli.' });
    }

    // Kullanıcı var mı kontrol et
    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ error: 'Kullanıcı adı zaten var.' });
    }

    // Şifre hashle
    const hash = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur
    const user = await User.create({ username, password: hash, role });

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu.',
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Boş alan kontrolü
    if (!username || !password) {
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli.' });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
    }

    // Şifre kontrolü
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Şifre hatalı.' });
    }

    // Token oluştur
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Giriş başarılı.',
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
};
