const mongoose = require('mongoose');

const roomStatusSchema = new mongoose.Schema({
    code: { type: String, required: true },
    status: { type: String, enum: ['active', 'pending', 'rent', 'terminated'], required: true }
  }, { 
    timestamps: false,
    collection: 'RoomStatus'
}); 
  
module.exports = mongoose.model('RoomStatus', roomStatusSchema);
  