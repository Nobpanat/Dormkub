// import model
const Booking = require('../models/Booking');
const BookingList = require('../models/BookingList');
const BookingStatus = require('../models/BookingStatus');
const Room = require('../models/Room');
const RoomStatus = require('../models/RoomStatus');
const ObjectId = require('mongoose').Types.ObjectId;

// create booking
exports.createBooking = async (req, res) => {
    const { roomId } = req.body;
    const userId = req.userId;  // มาจาก verifyJWT

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const statusId = "670e11817028eb47b304eead"; // status active
        const bookingStatus = await BookingStatus.findById(statusId);
        if (!bookingStatus) {
            return res.status(404).json({ message: 'Booking Status not found' });
        }

        // ตรวจสอบว่ามี booking list อยู่หรือไม่
        let bookingList = await BookingList.findOne({ user: userId }).populate({
            path: 'bookings', // populate ข้อมูล bookings
            select: 'id_room' // ดึงเฉพาะ id_room
        });

        if (bookingList) {
            // check ว่าใน bookingList มี booking ที่มี id_room นี้อยู่แล้วหรือไม่
            const isRoomBooked = bookingList.bookings.some(booking => booking.id_room.toString() === roomId);
            if (isRoomBooked) {
                return res.status(400).json({ message: 'Room already booked' });
            }
        } else {
            // ถ้าไม่มี booking list ให้สร้างใหม่
            bookingList = new BookingList({
                user: userId,
                bookings: []
            });
        }

        // สร้าง booking ใหม่
        const booking = new Booking({
            id_user: userId,
            id_room: roomId,
            total_price: room.totalPrice,
            date: new Date(),
            bookingStatus: statusId
        });

        // บันทึก booking ใหม่ลงใน bookingList
        bookingList.bookings.push(booking._id);
        await bookingList.save();
        await booking.save();

        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (err) {
        res.status(500).json({ message: 'Error creating booking', err });
    }
};


// Get all booking of user find from booking list and booking
// Get all booking of user find from booking list and booking
exports.getAllBooking = async (req, res) => {
    const userId = req.userId;  // มาจาก verifyJWT

    try {
        // หา booking list ของผู้ใช้และ populate ข้อมูล bookings พร้อม bookingStatus
        const bookingList = await BookingList.findOne({ user: userId }).populate({
            path: 'bookings',
            populate: [
                { 
                    path: 'bookingStatus' 
                },
                {
                    path: 'id_room',
                    populate: [ 
                            {path: 'id_dormitory'},
                            {path: 'roomStatus'}
                    ]
                    
                }
            ]

        });

        // หากไม่พบ booking list
        if (!bookingList) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        // กรองเฉพาะ booking ที่มีสถานะเป็น 'active'
        const activeBookings = bookingList.bookings.filter(
            booking => booking.bookingStatus.status === 'active'
        );

        // ส่ง response กลับพร้อม active bookings
        res.status(200).json({
            message: 'Successfully retrieved active bookings',
            bookings: activeBookings
        });
    } catch (err) {
        console.error('Error retrieving bookings:', err);
        res.status(500).json({ message: 'Internal server error while retrieving bookings' });
    }
};



// Delete booking from booking list and verify booking from user
// Delete booking from booking list and verify booking from user
exports.deleteBooking = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.userId; // From verifyJWT

    try {
        // Validate bookingId
        if (!ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID' });
        }

        // Find user's booking list
        const bookingList = await BookingList.findOne({ user: userId });

        // Check if booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking || !bookingList.bookings.includes(booking._id)) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Remove booking from user's booking list
        bookingList.bookings = bookingList.bookings.filter(
            id => id.toString() !== bookingId
        );

        // Save updated booking list and delete booking
        await bookingList.save();
        await booking.deleteOne();

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error('Error deleting booking:', err);
        res.status(500).json({ message: 'Internal server error while deleting booking' });
    }
};
