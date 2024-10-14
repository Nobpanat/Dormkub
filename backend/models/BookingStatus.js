const mongoose = require('mongoose');

const bookingStatusSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, enum: ['active', 'pending', 'rent', 'terminated'], required: true }
  }, { 
    timestamps: false,
    collection: 'BookingStatus'
}); 
  
module.exports = mongoose.model('BookingStatus', bookingStatusSchema);
  