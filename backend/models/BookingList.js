const mongoose = require('mongoose');

const bookingListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }], // เก็บรายการ booking หลายๆ รายการ
    totalPrice: { type: Number },
    bookingListStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingStatus' }
  }, { 
    timestamps: true,
    collection: 'BookingList'
}); 
  
module.exports = mongoose.model('BookingList', bookingListSchema);
  