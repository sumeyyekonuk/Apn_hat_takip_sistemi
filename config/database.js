
//Bu kod, Node.js ile MySQL veritabanına bağlantı kurmak için kullanılıyor. 
//Kodda kullanılan kütüphane Sequelize, bir ORM’dir 

// Sequelize kütüphanesinden sadece Sequelize sınıfını alıyoruz.
// Bu sınıfı kullanarak veritabanı bağlantısı oluşturacağız.
const { Sequelize } = require('sequelize');

// .env dosyasındaki ortam değişkenlerini (DB bilgilerini) içeri alıyoruz.
// Böylece şifre gibi hassas bilgileri kod içine yazmamış oluruz.
require('dotenv').config();

// Yeni bir Sequelize örneği oluşturuyoruz.
// Bu nesne, MySQL veritabanına bağlantı kurmak için gerekli bilgileri içerir.
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Veritabanı adı (örneğin: apn_hat_takip)
  process.env.DB_USER,       // MySQL kullanıcı adı (örneğin: root)
  process.env.DB_PASSWORD,   // MySQL şifresi (örneğin: Sk356600.)
  {
    host: process.env.DB_HOST,  // Veritabanı sunucusunun adresi (genelde: localhost)
    dialect: 'mysql',           // Kullanılan veritabanı türü (mysql, postgres, sqlite gibi)
    port: process.env.DB_PORT || 3307  // Port numarası (env dosyasındaysa onu alır, yoksa 3307 kullanır)
  }
);

// sequelize nesnesini dışa aktarıyoruz (export).
// Böylece diğer dosyalarda bu bağlantıyı kullanabiliriz.
module.exports = sequelize;





