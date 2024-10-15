
// import model
const Booking = require('../models/Booking');
const BookingList = require('../models/BookingList');
const BookingStatus = require('../models/BookingStatus');
const Room = require('../models/Room');
const RoomStatus = require('../models/RoomStatus');


// create booking
exports.createBooking = async (req, res) => {
    const { roomId , statusId} = req.body;
    const userId = req.userId;  // มาจาก verifyJWT

    try {
        const room = await Room.findById(roomId);
        if(!room){
            return res.status(404).json({ message: 'Room not found' });
        }

        const bookingStatus = await BookingStatus.findById(statusId);
        if(!bookingStatus){
            return res.status(404).json({ message: 'Booking Status not found' });
        }

        const booking = new Booking({
            id_user: userId,
            id_room: roomId,
            total_price: room.totalPrice,
            date: new Date(),
            bookingStatus: statusId
        });

        await booking.save();
        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (err) {
        res.status(500).json({ message: 'Error creating booking', err });
    }

}