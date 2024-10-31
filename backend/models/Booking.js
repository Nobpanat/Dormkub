const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id_room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    id_contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    total_price: { type: Number, required: true }, 
    date: { type: Date, required: true },
    bookingStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingStatus', required: true }, // เชื่อมกับ BookingStatus
    bookingList: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingList', required: true } // เชื่อมกับ BookingList
  }, { 
    timestamps: true,
    collection : 'Booking'
}); 
  
module.exports = mongoose.model('Booking', bookingSchema);
  