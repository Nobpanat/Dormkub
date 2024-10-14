const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true }, 
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  name: { type: String, required: true },
  profileImage: { type: String },
  phoneNumber: { type: String, required: true }
}, { timestamps: true }); // Add timestamps

module.exports = mongoose.model('User', userSchema);
