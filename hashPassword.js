const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'sifre123';  // Buraya kendi şifreni yazabilirsin
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

hashPassword();