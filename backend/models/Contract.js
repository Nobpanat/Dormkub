// models/Contract.js
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  dormitoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dormitory', required: true }, // อ้างอิงไปที่ Dormitory
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // เจ้าของหอพัก
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ผู้เช่า
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'subleased', 'terminated'], default: 'active' }, // สถานะสัญญา
  price: { type: Number, required: true },
  deposit: { type: Number, default: 0 }, // เงินมัดจำ
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contract', contractSchema);
