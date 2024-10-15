const mongoose = require('mongoose');

const contractStatusSchema = new mongoose.Schema({
    code: { type: String, required: true },
    status: { type: String, enum: ['active', 'pending', 'rent', 'terminated'], required: true }
  }, { 
    timestamps: false,
    collection: 'ContractStatus'
}); // ไม่จำเป็นต้องมี timestamps
  
  module.exports = mongoose.model('ContractStatus', contractStatusSchema);
  