const mongoose = require('mongoose');

const facilityListSchema = new mongoose.Schema({
    
    facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Facility' }] // เก็บรายการของ Facility หลายรายการ
  }, {
    timestamps: false ,
    collection: 'FacilityList'
  }); 
  
  module.exports = mongoose.model('FacilityList', facilityListSchema);
  