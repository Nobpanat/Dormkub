// ไม่ใช้



// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true }, // อ้างอิงไปที่สัญญา
  payerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้จ่าย
  payeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้รับ
  amount: { type: Number, required: true },
  type: { type: String, enum: ['rent',  'sublease'], required: true }, // ประเภทการทำธุรกรรม 1. ค่าเช่า 2. การเช่าช่วง
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // สถานะการทำธุรกรรม pending รอดำเนินการ
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now },
  currency: { type: String, default: 'THB' },
  idXendit: { type: String }, // รหัสอ้างอิงจาก Xendit
  // reminderTime: { type: Number, default: 1 }, // ระยะเวลาที่จะส่งการแจ้งเตือน
  // invoiceDuration: { type: Number, default: 172800 }, // ระยะเวลาที่ invoice มีอายุ
}, {
  timestamps: true, // เปิดใช้งาน timestamps (createdAt และ updatedAt จะถูกจัดการให้อัตโนมัติ)  
  collection: 'Transaction'
});

module.exports = mongoose.model('Transaction', transactionSchema);
