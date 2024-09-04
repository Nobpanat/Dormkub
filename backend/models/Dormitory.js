// models/Dormitory.js
const mongoose = require('mongoose');

const dormitorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // ชื่อหอพัก
  address: { type: String, required: true }, // ที่อยู่ของหอพัก
  price: { type: Number, required: true }, // ราคาเช่า
  description: { type: String }, // คำอธิบายเพิ่มเติมเกี่ยวกับหอพัก
  amenities: [{ type: String }], // สิ่งอำนวยความสะดวก เช่น Free Wi-Fi, Air Conditioning
  images: [{ type: String }], // URL ของรูปภาพหอพัก
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงไปที่เจ้าของหอพัก
  available: { type: Boolean, default: true }, // สถานะว่างให้เช่า
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
} , { 
  collection: 'Dorm' // ระบุชื่อ collection ให้ตรงกับที่อยู่ใน MongoDB
});

module.exports = mongoose.model('Dormitory', dormitorySchema);
