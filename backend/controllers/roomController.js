// import model
const Room = require("../models/Room");
const RoomStatus = require("../models/RoomStatus");
const User = require("../models/User");
const Dormitory = require("../models/Dormitory");
// const { default: mongoose } = require('mongoose');

const Facility = require("../models/Facility");
const FacilityList = require("../models/FacilityList");

const validator = require("validator");
const xss = require("xss");

// Sanitization function
function sanitizeRoomData(data) {
  return {
    
    roomtype: xss(data.roomtype),
    size: validator.escape(data.size.toString()),
    rent: parseFloat(data.rent),
    deposit: parseFloat(data.deposit),
    totalPrice: parseFloat(data.totalPrice),
    roomImage: data.roomImage ? data.roomImage.map(img => xss(img)) : [],
    facilities: data.facilities.map(facility => xss(facility)),
    amount: validator.escape(data.amount.toString()),
  };
}

// create room
// create room
exports.createRoom = async (req, res) => {
  const userId = req.userId; // มาจาก verifyJWT
  const roomStatus = "670e13b258f0e080c662d971"; // status active
  const { dormitoryId } = req.params;
  const id_dormitory = dormitoryId;

  try {
    // Sanitize and validate input data
    const {
      roomtype,
      size,
      rent,
      deposit,
      totalPrice,
      roomImage,
      facilities,
      amount,
    } = sanitizeRoomData(req.body);

    // Check if numeric values are valid
    if ([rent, deposit, totalPrice].some(val => isNaN(val))) {
      return res.status(400).json({ message: "Invalid numeric values for rent, deposit, or totalPrice" });
    }

    const [user, dormitory] = await Promise.all([
      User.findById(userId),
      Dormitory.findById(id_dormitory)
    ]);

    if (!user) return res.status(400).json({ message: "User not found" });
    if (!dormitory) return res.status(400).json({ message: "Dormitory not found" });

    // Check if user is the dormitory owner
    if (dormitory.id_owner_Dormitory.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner of this dormitory" });
    }

    // Validate facility IDs
    const facilityValidation = await Promise.all(
      facilities.map(facilityId => Facility.findById(facilityId))
    );
    if (facilityValidation.includes(null)) {
      return res.status(404).json({ message: "Some facilities not found" });
    }

    const facilityList = new FacilityList({ facilities });
    const room = new Room({
      id_owner_room: userId,
      id_dormitory,
      roomtype,
      size,
      rent,
      deposit,
      totalPrice,
      roomStatus,
      roomImage,
      id_facilityList: facilityList._id,
      amount,
    });

    facilityList.roomId = room._id;
    await facilityList.save();
    await room.save();

    // Add room ID to dormitory's rooms array and save dormitory
    dormitory.rooms.push(room._id);
    await dormitory.save();

    res.status(201).json({ message: "Room created successfully", room, facilityList });
  } catch (err) {
    console.error("Room Creation Error:", err); // Logging only for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};


// update room
exports.updateRoom = async (req, res) => {
  const userId = req.userId; // มาจาก verifyJWT
  const roomId = req.params.id;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is the room owner
    if (room.id_owner_room.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner of this room" });
    }

    // Sanitize and validate input data
    const sanitizedData = sanitizeRoomData(req.body);

    // Update room only with valid data
    room.roomtype = sanitizedData.roomtype || room.roomtype;
    room.size = sanitizedData.size || room.size;
    room.rent = !isNaN(sanitizedData.rent) ? sanitizedData.rent : room.rent;
    room.deposit = !isNaN(sanitizedData.deposit) ? sanitizedData.deposit : room.deposit;
    room.totalPrice = !isNaN(sanitizedData.totalPrice) ? sanitizedData.totalPrice : room.totalPrice;

    await room.save();
    res.status(200).json({ message: "Room updated successfully", room });
  } catch (err) {
    console.error("Room Update Error:", err); // Logging only for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get Room by ID
exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id)
      .populate("id_owner_room", "_id name profileImage phoneNumber")
      .populate("roomStatus", "_id status")
      .populate(
        "id_dormitory",
        "_id name id_owner_Dormitory description address dormitoryImage"
      )
      .populate({
        path: "id_facilityList",
        populate: {
          path: "facilities", // Assuming this is the field inside FacilityList
          model: "Facility", // Reference to the Facility model
          select: "_id name", // Only retrieve the _id and name of the facility
        },
      });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
  

    res.status(200).json({ message: "Room found", room });
  } catch (err) {
    res.status(500).json({ message: "Error fetching room data", err });
  }
};

// Get All Rooms
// Get All Rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("id_owner_room", "_id name email profileImage phoneNumber")
      .populate("roomStatus", "_id status")
      .populate(
        "id_dormitory",
        "_id name id_owner_Dormitory description address dormitoryImage"
      )
      .populate({
        path: "id_facilityList",
        populate: {
          path: "facilities", // Assuming this is the field inside FacilityList
          model: "Facility", // Reference to the Facility model
          select: "_id name", // Only retrieve the _id and name of the facility
        },
      });

    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching room data", err });
  }
};

// Delete Room by ID
exports.deleteRoomById = async (req, res) => {
  const userId = req.userId; // มาจาก verifyJWT
  const roomId = req.params.id;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // check if the user is the owner of the room
    if (room.id_owner_room != userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this room" });
    }

    await Room.findByIdAndDelete(roomId);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting room", err });
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
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // check if the user is the owner of the room
    if (room.id_owner_room != userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this room" });
    }

    const roomStatus = await RoomStatus.findById(statusId);
    if (!roomStatus) {
      return res.status(404).json({ message: "Room Status not found" });
    }

    room.roomStatus = statusId;
    await room.save();
    res.status(200).json({ message: "Room status updated successfully", room });
  } catch (err) {
    res.status(500).json({ message: "Error updating room status", err });
  }
};

// Get all suggest room
exports.getAllSuggestRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("id_dormitory")
      .populate({
        path: "roomStatus", // เชื่อมกับ RoomStatus
        match: { status: "active" }, // กรองเฉพาะ roomStatus ที่เป็น 'Active'
      });

    const filteredRooms = rooms.filter((room) => room.roomStatus); // กรองเฉพาะห้องที่มี roomStatus เป็น Active

    // console.log(rooms[1].roomStatus.status);
    res.status(200).json(filteredRooms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching suggest room data", err });
  }
};
