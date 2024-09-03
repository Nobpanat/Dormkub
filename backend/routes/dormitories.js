// routes/dormitories.js
const express = require('express');
const router = express.Router();
const Dormitory = require('../models/Dormitory');

// GET all dormitories
router.get('/', async (req, res) => {
  try {
    const dormitories = await Dormitory.find();
    console.log('Fetched dormitories:', dormitories); //  debug 
    res.json(dormitories);
  } catch (err) {
    console.error('Error fetching dormitories:', err); //  debug 
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
