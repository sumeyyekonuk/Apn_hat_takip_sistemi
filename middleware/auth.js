//Express.js için bir JWT (JSON Web Token) doğrulama ve yetkilendirme middleware fonksiyonu
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'apn_secret_key';

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token gerekli.' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Yetkisiz erişim.' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Geçersiz token.' });
    }
  };
};

// 1. İstek header'ından "Authorization" başlığını kontrol eder, "Bearer <token>" formatında olmalı.
// 2. Token yoksa 401 Unauthorized döner (Token gerekli).
// 3. Token varsa, JWT gizli anahtarıyla token doğrulanır (verify).
// 4. Token geçerliyse, içindeki kullanıcı bilgileri (payload) req.user içine konur.
// 5. Eğer middleware'e özel bir role listesi verilmişse ve kullanıcının rolü o listede yoksa 403 Forbidden döner (Yetkisiz erişim).
// 6. Her şey uygunsa bir sonraki middleware veya route handler'a geçilir (next()).
// 7. Token doğrulama başarısızsa 401 Unauthorized döner (Geçersiz token).
