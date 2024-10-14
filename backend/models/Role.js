const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    code: { type: String, required: true }, 
    role: { type: String, enum: ['tenant', 'ownerDormitory', 'ownerContract'], required: true }
  }, 
  { 
    timestamps: false,
    collection: 'Role' 
}); 
  
module.exports = mongoose.model('Role', roleSchema);
  