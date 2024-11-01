// routes/bookings.js

const express = require('express');
const router = express.Router();

// import booking controller
const bookingController = require('../controllers/bookingController');
const verifyJWT = require('../middleware/verifyJWT');

// POST /api/bookings/ สร้างการจอง
router.post('/', verifyJWT, bookingController.createBooking);

// GET /api/booking ดึงรายการการจองทั้งหมดของแต่ละ user
router.get('/', verifyJWT, bookingController.getAllBooking);

// DELETE /api/booking/:id ลบการจอง
router.delete('/:bookingId', verifyJWT, bookingController.deleteBooking);

// POST /api/bookings/pay ชำระเงิน
router.post('/payment/payAll', verifyJWT, bookingController.payAllBookings);

// GET /api/bookings/history ดึงประวัติการจอง
router.get('/history', verifyJWT, bookingController.getBookingHistory);

module.exports = router;