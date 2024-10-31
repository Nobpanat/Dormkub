const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  id_owner_lessor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  file_contract: { type: String }, 
  roomImage : [{ type: String }],
  description: { type: String },
  contractStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'ContractStatus', required: true },// เชื่อมกับ ContractStatus
  DormitoryName : { type: String, required: true },
  rent : { type: Number, required: true },
  deposit : { type: Number, required: true },
  totalPrice : { type: Number, required: true },
  address : { type: String, required: true },
  id_facilityList: { type: mongoose.Schema.Types.ObjectId, ref: 'FacilityList' }, // เชื่อมกับ FacilityList
  roomType : { type: String, required: true },
  size : { type: Number, required: true },
  
}, { 
  timestamps: true,
  collection: 'Contract'
}); 

module.exports = mongoose.model('Contract', contractSchema);

