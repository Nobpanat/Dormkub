const mongoose = require('mongoose');

const facilityListSchema = new mongoose.Schema({
    name: { type: String, required: true }, // หมวดหมู่สิ่งอำนวยความสะดวก เช่น ภายในห้อง/ในพื้นที่ส่วนกลาง
    facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Facility' }] // เก็บรายการของ Facility หลายรายการ
  }, {
    timestamps: false ,
    collection: 'FacilityList'
  }); 
  
  module.exports = mongoose.model('FacilityList', facilityListSchema);
  