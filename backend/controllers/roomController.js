// import model
const Room = require('../models/Room');
const RoomStatus = require('../models/RoomStatus');
const User = require('../models/User');
const Dormitory = require('../models/Dormitory');
// const { default: mongoose } = require('mongoose');



// create room
exports.createRoom = async (req, res) => {
    const userId = req.userId; // มาจาก verifyJWT
    const { id_dormitory, roomtype , size , rent , deposit , totalPrice ,roomImage } = req.body;
    const roomStatus = "670e13b258f0e080c662d971"; // status active

    try {
        const user = await User.findById(userId);
        const dormitory = await Dormitory.findById(id_dormitory);
        if(!user){
            return res.status(400).json({ message: 'User not found' });
        }
        if(!dormitory){
            return res.status(400).json({ message: 'Dormitory not found' });
        }

        // check if the user is the owner of the dormitory
        if(dormitory.id_owner_Dormitory != userId){
            return res.status(403).json({ message: 'You are not the owner of this dormitory' });
        }

        const room = new Room({
            id_owner_room: userId,
            id_dormitory: id_dormitory,
            roomtype : roomtype,
            size : size,
            rent: rent,
            deposit: deposit,
            totalPrice: totalPrice,
            roomStatus: roomStatus,
            roomImage: roomImage

        });

        await room.save();
        res.status(201).json({ message: 'Room created successfully', room });
    } catch (err) {
        res.status(500).json({ message: 'Error creating room', err });
    }
};

// update room
exports.updateRoom = async (req, res) => {
    const userId = req.userId; // มาจาก verifyJWT
    const { roomtype , size , rent , deposit , totalPrice } = req.body;
    const roomId = req.params.id;

    try {
        const room = await Room.findById(roomId);
        if(!room){
            return res.status(403).json({ message: 'Room not found' });
        }

        // check if the user is the owner of the room
        if(room.id_owner_room != userId){
            return res.status(403).json({ message: 'You are not the owner of this room' });
        }

        // update room
        room.roomtype = roomtype || room.roomtype;
        room.size = size || room.size;
        room.rent = rent || room.rent;
        room.deposit = deposit || room.deposit;
        room.totalPrice = totalPrice || room.totalPrice;

        await room.save();
        res.status(200).json({ message: 'Room updated successfully', room });
    } catch (err) {
        res.status(500).json({ message: 'Error updating room', err });
    }
};

// Get Room by ID
exports.getRoomById = async (req, res) => {
    const {id} = req.params;
    try{
        const room = await Room.findById(id)
        .populate('id_owner_room', '_id name email profileImage phoneNumber')
            .populate('roomStatus', '_id status')
            .populate('id_dormitory', '_id name id_owner_Dormitory description address dormitoryImage')
            .populate({
                path: 'id_facilityList',
                populate: {
                    path: 'facilities', // Assuming this is the field inside FacilityList
                    model: 'Facility',  // Reference to the Facility model
                    select: '_id name'  // Only retrieve the _id and name of the facility
                }
            });

        if(!room){
            return res.status(404).json({ message: 'Room not found'});
        }
        console.log("room ",room);

        res.status(200).json({message: 'Room found', room});
    } catch (err) {
        res.status(500).json({ message: 'Error fetching room data', err });
    }

};


// Get All Rooms
// Get All Rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate('id_owner_room', '_id name email profileImage phoneNumber')
            .populate('roomStatus', '_id status')
            .populate('id_dormitory', '_id name id_owner_Dormitory description address dormitoryImage')
            .populate({
                path: 'id_facilityList',
                populate: {
                    path: 'facilities', // Assuming this is the field inside FacilityList
                    model: 'Facility',  // Reference to the Facility model
                    select: '_id name'  // Only retrieve the _id and name of the facility
                }
            });

        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching room data', err });
    }
};



// Delete Room by ID
exports.deleteRoomById = async (req, res) => {
    const userId = req.userId; // มาจาก verifyJWT
    const roomId = req.params.id;

    try {
        const room = await Room.findById(roomId);
        if(!room){
            return res.status(404).json({ message: 'Room not found' });
        }

        // check if the user is the owner of the room
        if(room.id_owner_room != userId){
            return res.status(403).json({ message: 'You are not the owner of this room' });
        }

        await Room.findByIdAndDelete(roomId);
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting room', err });
    }
};


// Update Room Status
exports.updateRoomStatus = async (req, res) => {
    const userId = req.userId; // มาจาก verifyJWT
    const { statusId } = req.body;
    const roomId = req.params.id;

    //update room status
    try {
        const room = await Room.findById(roomId);
        if(!room){
            return res.status(404).json({ message: 'Room not found' });
        }

        // check if the user is the owner of the room
        if(room.id_owner_room != userId){
            return res.status(403).json({ message: 'You are not the owner of this room' });
        }

        const roomStatus = await RoomStatus.findById(statusId);
        if(!roomStatus){
            return res.status(404).json({ message: 'Room Status not found' });
        }

        room.roomStatus = statusId;
        await room.save();
        res.status(200).json({ message: 'Room status updated successfully', room });
    } catch (err) {
        res.status(500).json({ message: 'Error updating room status', err });
    }
};


// Get all suggest room
exports.getAllSuggestRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
        .populate('id_dormitory')
        .populate({
            path: 'roomStatus', // เชื่อมกับ RoomStatus
            match: { status: 'active' } // กรองเฉพาะ roomStatus ที่เป็น 'Active'
        });

        const filteredRooms = rooms.filter(room => room.roomStatus); // กรองเฉพาะห้องที่มี roomStatus เป็น Active

        // console.log(rooms[1].roomStatus.status);
        res.status(200).json(filteredRooms);

    } catch (err) {
        res.status(500).json({ message: 'Error fetching suggest room data', err });
    }

};