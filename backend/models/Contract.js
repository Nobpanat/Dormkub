const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  id_owner_lessor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id_tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  file_contract: { type: String }, 
  description: { type: String },
  contractStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'ContractStatus', required: true } // เชื่อมกับ ContractStatus
}, { 
  timestamps: true,
  collection: 'Contract'
}); 

module.exports = mongoose.model('Contract', contractSchema);

