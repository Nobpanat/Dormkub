const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    id_owner_room: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id_dormitory: { type: mongoose.Schema.Types.ObjectId, ref: 'Dormitory', required: true },
    roomtype: { type: String, required: true },
    size: { type: Number, required: true }, 
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true }, 
    totalPrice: { type: Number, required: true },
    roomStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomStatus', required: true } // เชื่อมกับ RoomStatus
  }, { 
    timestamps: true,
    collection: 'Room'
  }); 
  
module.exports = mongoose.model('Room', roomSchema);
  