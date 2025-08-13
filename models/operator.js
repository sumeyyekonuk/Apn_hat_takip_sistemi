const { DataTypes } = require('sequelize'); // sequelize kütüphanesinden veri tipleri alır
const sequelize = require('../config/database'); //veritabanı bağlantı ayarları dosyası import edildi

const Operator = sequelize.define('Operator', { //Operator modeli tanımlandı sequelize bunu tablo ile eşletirir
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'operators',
  timestamps: true,  
})


module.exports = Operator; //diğer dosyalarda kullanmak için export edildi.
