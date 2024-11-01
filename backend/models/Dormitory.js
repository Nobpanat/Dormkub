// models/Dormitory.js
const mongoose = require('mongoose');

const dormitorySchema = new mongoose.Schema({
  id_owner_Dormitory: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  dormitoryImage: [{ type: String }], 
  rooms : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dormitory' }],
}, {
   timestamps: true,
   collection: 'Dormitory'
  }); 

module.exports = mongoose.model('Dormitory', dormitorySchema);

