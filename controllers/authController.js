//kullanıcıların kayıt olma ve giriş yapma işlemlerini yönetir.
const bcrypt = require('bcryptjs');  
// Şifreleri güvenli şekilde saklamak için hashleme yapmaya yarayan kütüphane.

const jwt = require('jsonwebtoken');  
// Kullanıcıya giriş sonrası token (kimlik doğrulama) oluşturmak için kütüphane.

const { User } = require('../models');  
// Veritabanındaki User (kullanıcı) modelini çağırıyoruz.

const JWT_SECRET = process.env.JWT_SECRET || 'apn_secret_key';  
// JWT token'ını oluştururken kullanılan gizli anahtar. Ortam değişkeni yoksa 'apn_secret_key' varsayılan.

// Kullanıcı kayıt fonksiyonu:
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;  
    // İstekten username, password ve role verilerini alıyoruz.

    if (!username || !password) {  
    // Eğer username veya password boşsa,
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli.' });  
      // 400 Bad Request hatası ve açıklama mesajı gönderiyoruz.
    }

    const exists = await User.findOne({ where: { username } });  
    // Veritabanında aynı username ile bir kullanıcı var mı diye kontrol ediyoruz.

    if (exists) {  
    // Eğer varsa,
      return res.status(400).json({ error: 'Kullanıcı adı zaten var.' });  
      // 400 hatası dönüyoruz.
    }

    const hash = await bcrypt.hash(password, 10);  
    // Şifreyi bcrypt ile 10 kere karma (hash) algoritmasından geçiriyoruz, güvenli hale getiriyoruz.

    const user = await User.create({ username, password: hash, role });  
    // Yeni kullanıcıyı veritabanına şifre hashlenmiş haliyle kaydediyoruz.

    res.status(201).json({  
    // Başarılı kayıt olursa 201 Created kodu ile birlikte kullanıcı bilgilerini (şifresiz) gönderiyoruz.
      message: 'Kullanıcı başarıyla oluşturuldu.',
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err);  
    // Eğer bir hata çıkarsa, konsola hata yazdırıyoruz.
    res.status(500).json({ error: 'Sunucu hatası.' });  
    // 500 Internal Server Error ile hata mesajı gönderiyoruz.
  }
};

// Kullanıcı giriş fonksiyonu:
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;  
    // İstekten username ve password alıyoruz.

    if (!username || !password) {  
    // Eğer boşsa,
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli.' });  
      // 400 Bad Request dönüyoruz.
    }

    const user = await User.findOne({ where: { username } });  
    // Veritabanından username ile kullanıcıyı arıyoruz.

    if (!user) {  
    // Bulamazsak,
      return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });  
      // 401 Unauthorized döndürüyoruz.
    }

    const valid = await bcrypt.compare(password, user.password);  
    // Girilen şifre ile veritabanındaki hashlenmiş şifreyi karşılaştırıyoruz.

    if (!valid) {  
    // Eğer eşleşmezse,
      return res.status(401).json({ error: 'Şifre hatalı.' });  
      // 401 Unauthorized dönüyoruz.
    }

    const token = jwt.sign(  
    // Şifre doğruysa JWT token oluşturuyoruz,
      { id: user.id, role: user.role },  // Token içeriğinde kullanıcı id ve rol bilgisi var,
      JWT_SECRET,                        // Gizli anahtarla imzalanıyor,
      { expiresIn: '1d' }               // Token 1 gün geçerli.
    );

    res.json({  
    // Token ve kullanıcı bilgilerini json olarak döndürüyoruz.
      message: 'Giriş başarılı.',
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);  
    // Hata varsa konsola yazdırıyoruz.
    res.status(500).json({ error: 'Sunucu hatası.' });  
    // 500 Internal Server Error ile cevap veriyoruz.
  }
};
