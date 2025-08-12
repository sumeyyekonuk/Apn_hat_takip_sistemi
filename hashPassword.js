// bcryptjs kullanarak şifreyi hashleme örneği

const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'sifre123';  // Hashlemek istediğiniz düz metin şifre
  const hash = await bcrypt.hash(password, 10); // 10: saltRounds, ne kadar karmaşık olacağı
  console.log(hash); // Hashlenmiş şifreyi konsola yazdırır
}

hashPassword();
