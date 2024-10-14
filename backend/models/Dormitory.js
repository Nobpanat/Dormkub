// models/Dormitory.js
const mongoose = require('mongoose');

const dormitorySchema = new mongoose.Schema({
  id_owner_Dormitory: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  dormitoryImage: [{ type: String }], 
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
   timestamps: true,
   collection: 'Dormitory'
  }); 

module.exports = mongoose.model('Dormitory', dormitorySchema);

