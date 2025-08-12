const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true,    // Her yeni kullanıcı için otomatik artan ID
    primaryKey: true        // Birincil anahtar (benzersiz)
  },
  username: { 
    type: DataTypes.STRING, 
    unique: true,           // Aynı kullanıcı adı birden fazla olamaz
    allowNull: false        // Boş olamaz
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false        // Şifre boş bırakılamaz
  },
  role: { 
    type: DataTypes.ENUM('admin', 'user', 'readonly'),  // Kullanıcı rolü sadece bu 3 değerden biri olabilir
    defaultValue: 'user'        // Rol belirtilmezse 'user' olur
  }
}, {
  tableName: 'users',     // Veritabanındaki tablo ismi
  timestamps: true        // createdAt ve updatedAt otomatik eklenir
});


module.exports = User;