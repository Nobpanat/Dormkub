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
    const { roomId, contractId } = req.body;  // Include contractId for contract booking
    const userId = req.userId;  // From verifyJWT

    console.log("contract id ", contractId);

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
        
        // console.log("item ", item);

        if (!item) {
            return res.status(404).json({ message: `${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} not found` });
        }

        const statusId = "670e11817028eb47b304eead"; // Status active
        const bookingStatus = await BookingStatus.findById(statusId);
        if (!bookingStatus) {
            return res.status(404).json({ message: 'Booking Status not found' });
        }

        // console.log("test 1")
        let bookingList = await BookingList.findOne({ user: userId }).populate({
            path: 'bookings', // Populate bookings
            select: bookingType === 'room' ? 'id_room' : 'id_contract' // Populate specific ID based on type
        });
        // console.log("test 2")

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
                totalPrice: 0
            });
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
    const userId = req.userId; // from verifyJWT

    try {
        // Find the user's booking list and populate bookings with bookingStatus, id_room, and id_contract
        const bookingList = await BookingList.findOne({ user: userId }).populate({
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
                    path: 'id_contract', // Populate contract details
                    populate: [
                        { path: 'contractStatus' }, // Additional fields for contract if needed
                    ]
                }
            ]
        });

        // If no booking list is found
        if (!bookingList) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        // Filter for active bookings
        const activeBookings = bookingList.bookings.filter(
            booking => booking.bookingStatus.status === 'active'
        );

        // console.log("total price of booking list ", bookingList.totalPrice);
        const totalPrice = bookingList.totalPrice;

        const bookingListId = bookingList._id;
        // Send response with active bookings
        res.status(200).json({
            message: 'Successfully retrieved active bookings',
            bookings: activeBookings,
            totalPrice: totalPrice,
            bookingListId : bookingListId
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

