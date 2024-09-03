// models/Dormitory.js
const mongoose = require('mongoose');

const dormitorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  amenities: [String],
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},{ collection: 'Dorm' });

module.exports = mongoose.model('Dormitory', dormitorySchema);
