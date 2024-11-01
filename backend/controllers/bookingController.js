// import model
const Booking = require('../models/Booking');
const BookingList = require('../models/BookingList');
const BookingStatus = require('../models/BookingStatus');
const Room = require('../models/Room');
const RoomStatus = require('../models/RoomStatus');
const ObjectId = require('mongoose').Types.ObjectId;
const Contract = require('../models/Contract');

// create booking
exports.createBooking = async (req, res) => {
    const { roomId, contractId } = req.body;
    const userId = req.userId;
    const statusId = "670e11817028eb47b304eead"; // Active status

    try {
        let item, totalPrice, bookingType;

        if (roomId) {
            item = await Room.findById(roomId);
            bookingType = 'room';
            totalPrice = item.totalPrice;
        } else if (contractId) {
            item = await Contract.findById(contractId);
            bookingType = 'contract';
            totalPrice = item.totalPrice;
        } else {
            return res.status(400).json({ message: 'No valid item to book' });
        }

        if (!item) {
            return res.status(404).json({ message: `${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} not found` });
        }

        let bookingList = await BookingList.findOne({ user: userId, bookingListStatus: statusId }).populate({
            path: 'bookings',
            select: bookingType === 'room' ? 'id_room' : 'id_contract'
        });

        if (bookingList) {
            const isItemBooked = bookingList.bookings.some(
                booking => bookingType === 'room' ? booking.id_room?.toString() === roomId : booking.id_contract?.toString() === contractId
            );
            if (isItemBooked) {
                return res.status(400).json({ message: `${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} already booked` });
            }
        } else {
            bookingList = new BookingList({
                user: userId,
                bookings: [],
                totalPrice: 0,
                bookingListStatus: statusId
            });
            await bookingList.save();
        }

        const booking = new Booking({
            id_user: userId,
            [bookingType === 'room' ? 'id_room' : 'id_contract']: item._id,
            total_price: totalPrice,
            date: new Date(),
            bookingStatus: statusId,
            bookingList: bookingList._id
        });

        bookingList.bookings.push(booking._id);
        bookingList.totalPrice += booking.total_price;

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
    const userId = req.userId;
    const statusId = "670e11817028eb47b304eead"; // ID สำหรับสถานะ active

    try {
        // ค้นหา bookingList ของผู้ใช้ที่มีสถานะ active เท่านั้น
        const bookingList = await BookingList.findOne({ user: userId, bookingListStatus: statusId }).populate({
            path: 'bookings',
            populate: [
                { path: 'bookingStatus' },
                {
                    path: 'id_room',
                    populate: [
                        { path: 'id_dormitory' },
                        { path: 'roomStatus' }
                    ]
                },
                {
                    path: 'id_contract',
                    populate: [
                        { path: 'contractStatus' }
                    ]
                }
            ]
        });

        // ถ้าไม่พบ bookingList ที่มีสถานะ active
        if (!bookingList) {
            return res.status(404).json({ message: 'No active bookings found for this user' });
        }

        // กรองเฉพาะการจองที่มีสถานะเป็น active ใน bookingList ที่ตรงกับสถานะที่ต้องการ
        const activeBookings = bookingList.bookings.filter(
            booking => booking.bookingStatus && booking.bookingStatus._id.toString() === statusId
        );

        // นำข้อมูลทั้งหมดส่งกลับเป็น JSON response
        res.status(200).json({
            message: 'Successfully retrieved active bookings',
            bookings: activeBookings,
            totalPrice: bookingList.totalPrice,
            bookingListId: bookingList._id
        });
    } catch (err) {
        console.error('Error retrieving bookings:', err);
        res.status(500).json({ message: 'Internal server error while retrieving bookings' });
    }
};





// Delete booking from booking list and verify booking from user
// Delete booking from booking list and verify booking from user
// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;

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
        if (!bookingList) {
            return res.status(404).json({ message: 'Booking list not found' });
        }

        // Check if booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking || !bookingList.bookings.some(id => id.equals(booking._id))) {
            return res.status(404).json({ message: 'Booking not found in user booking list' });
        }

        // Remove booking from user's booking list
        bookingList.bookings = bookingList.bookings.filter(id => !id.equals(booking._id));

        // Deduct the total price of the booking from booking list's totalPrice
        bookingList.totalPrice -= booking.total_price;

        // Save updated booking list and delete booking
        await bookingList.save();
        await booking.deleteOne();

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error('Error deleting booking:', err);
        res.status(500).json({ message: 'Internal server error while deleting booking' });
    }
};


// payAllBookings
// payAllBookings
exports.payAllBookings = async (req, res) => {
    const userId = req.userId; // From verifyJWT
    const rentStatusId = "670e11817028eb47b304eeb3"; // Rent status ID for bookings
    const contractStatusId = "670e13f8c2bb7a6bc17215b2"; // New status ID for contract

    try {
        // Fetch the user's booking list
        let bookingList = await BookingList.findOne({ user: userId, bookingListStatus: "670e11817028eb47b304eead" }).populate({
            path: 'bookings',
            populate: [
            { path: 'id_room' },
            { path: 'id_contract' },
            { path: 'bookingStatus' }
            ]
        });
        
        if (!bookingList) {
            return res.status(404).json({ message: 'No booking list found for the user' });
        }

        // Check if any bookings are already in rent status to prevent duplicate updates
        const alreadyRented = bookingList.bookings.some(booking => booking.bookingStatus.toString() === rentStatusId);
        if (alreadyRented) {
            return res.status(400).json({ message: 'Bookings already rented' });
        }

        // Loop through each booking
        for (let booking of bookingList.bookings) {
            // Update amount for rooms if the booking is associated with an id_room
            if (booking.id_room) {
                await Room.findByIdAndUpdate(
                    booking.id_room._id,
                    { $inc: { amount: -1 } } // Decrease amount by 1
                );
            }

            // Update contract status if the booking is associated with an id_contract
            if (booking.id_contract) {
                await Contract.findByIdAndUpdate(
                    booking.id_contract._id,
                    { contractStatus: contractStatusId } // Update to new contract status
                );
            }
        }

        // Update each booking's status to rent
        await Booking.updateMany(
            { _id: { $in: bookingList.bookings.map(booking => booking._id) } },
            { bookingStatus: rentStatusId }
        );

        console.log('All bookings paid successfully');
        // Update the booking list status to rent
        bookingList.bookingListStatus = rentStatusId;
        await bookingList.save();

        res.status(200).json({ message: 'All bookings paid successfully' });
    } catch (err) {
        console.error("Error updating bookings:", err);
        res.status(500).json({ message: 'Error paying all bookings', error: err });
    }
};

// getBookingListHistory
// getBookingHistory
exports.getBookingHistory = async (req, res) => {
    const userId = req.userId; // มาจาก verifyJWT
    const rentStatusId = "670e11817028eb47b304eeb3"; // Rent status ID

    try {
        // ค้นหา bookingList ของผู้ใช้ที่มีสถานะ rent
        const bookingList = await BookingList.find({
            user: userId,
            bookingListStatus: rentStatusId
        }).populate({
            path: 'bookings',
            populate: [
                { path: 'bookingStatus' },
                {
                    path: 'id_room',
                    populate: [
                        { path: 'id_dormitory' },
                        { path: 'roomStatus' }
                    ]
                },
                {
                    path: 'id_contract',
                    populate: [{ path: 'contractStatus' }]
                }
            ]
        });

        // ตรวจสอบว่าเจอ bookingList หรือไม่
        if (!bookingList || bookingList.length === 0) {
            return res.status(404).json({ message: 'No rent history found for this user' });
        }

        // ส่งข้อมูล bookingList ที่มีสถานะ rent กลับไปยังผู้ใช้
        res.status(200).json({
            message: 'Successfully retrieved rent booking history',
            bookingList
        });
    } catch (err) {
        console.error("Error retrieving rent booking history:", err);
        res.status(500).json({ message: 'Error retrieving rent booking history', error: err });
    }
};

