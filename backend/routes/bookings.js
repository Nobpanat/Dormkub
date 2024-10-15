// routes/bookings.js

const express = require('express');
const router = express.Router();

// import booking controller
const bookingController = require('../controllers/bookingController');
const verifyJWT = require('../middleware/verifyJWT');

// POST /api/bookings/ สร้างการจอง
router.post('/', verifyJWT, bookingController.createBooking);


module.exports = router;