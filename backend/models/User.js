// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // ID จาก Google Account
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['owner', 'tenant'], required: true }, // กำหนดบทบาทเป็นเจ้าของหรือผู้เช่า
  profileImage: String, // URL ของภาพโปรไฟล์จาก Google
  phoneNumber: String, // เบอร์โทรศัพท์
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now }
},{
  timestamps: true, // เปิดใช้งาน timestamps (createdAt และ updatedAt จะถูกจัดการให้อัตโนมัติ)
  collection: 'User'
});

module.exports = mongoose.model('User', userSchema);
