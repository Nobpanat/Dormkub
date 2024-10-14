const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    name: { type: String, required: true } // ชื่อสิ่งอำนวยความสะดวก
  }, { 
    timestamps: false,
    collection: 'Facility'
}); 
  
  module.exports = mongoose.model('Facility', facilitySchema);
  