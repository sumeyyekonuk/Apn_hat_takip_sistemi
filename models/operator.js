
// Bu dosya sayesinde Sequelize, operators adında bir tabloyla ilişkilendirilmiş bir Operator modeli oluşturur.

const { DataTypes } = require('sequelize'); // Sequelize'den veri türlerini alıyoruz
const sequelize = require('../config/database'); // Daha önce oluşturduğumuz veritabanı bağlantısını alıyoruz

// "Operator" adında bir model tanımlıyoruz (bu JS tarafında kullanılacak isim)
const Operator = sequelize.define('Operator', {
  id: {
    type: DataTypes.INTEGER,       // Veri tipi: tamsayı
    autoIncrement: true,           // Her yeni kayıt için sayı otomatik artar
    primaryKey: true               // Bu alan birincil anahtar (primary key)
  },
  name: {
    type: DataTypes.STRING,        // Veri tipi: metin (varchar)
    allowNull: false               // Boş bırakılamaz
  }
}, {
  tableName: 'operators',          // Veritabanında bu modelin karşılığı olan tablo adı
  timestamps: false                // createdAt ve updatedAt gibi otomatik zaman alanları oluşturulmasın
});

module.exports = Operator; // Bu modeli dışa aktarıyoruz ki controller gibi diğer dosyalarda kullanılabilsin