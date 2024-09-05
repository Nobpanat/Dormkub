// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true }, // อ้างอิงไปที่สัญญา
  payerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้จ่าย
  payeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้รับ
  amount: { type: Number, required: true },
  type: { type: String, enum: ['rent', 'deposit', 'sublease'], required: true }, // ประเภทการทำธุรกรรม
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // สถานะการทำธุรกรรม pending รอดำเนินการ
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'Transaction'
});

module.exports = mongoose.model('Transaction', transactionSchema);
