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