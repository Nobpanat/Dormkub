const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true }, 
  email : { type: String, required: true },
  // id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  name: { type: String, required: true },
  profileImage: { type: String },
  phoneNumber: { type: String },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] // เชื่อมโยงกับ Role
}, 
{ 
  timestamps: true,
  collection: 'User'
}); // Add timestamps

module.exports = mongoose.model('User', userSchema);
