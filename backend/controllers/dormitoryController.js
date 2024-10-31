// import model Dormitory , User
const Dormitory = require("../models/Dormitory");
const User = require("../models/User");
const Room = require("../models/Room");

const xss = require("xss");
const mongoose = require("mongoose");
const validator = require("validator");

// create dormitory
exports.createDormitory = async (req, res) => {
    const userId = req.userId;
    let { name, description, address, dormitoryImage } = req.body;

    // sanitize ข้อมูลด้วย xss
    name = xss(String(name));
    description = xss(String(description));
    address = xss(String(address));
    
    // ถ้า dormitoryImage เป็น array ให้ sanitize แต่ละ string
    if (Array.isArray(dormitoryImage)) {
        dormitoryImage = dormitoryImage.map(img => xss(String(img)));
    } else {
        dormitoryImage = xss(String(dormitoryImage));
    }

    // validate input
    if (!validator.isMongoId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!validator.isLength(name, { min: 3, max: 100 })) {
        return res.status(400).json({ message: "Name must be between 3 and 100 characters" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // ตรวจสอบ role
        if (!user.roles.includes("670ce4436fde0ada14f72f9b")) {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { roles: "670ce4436fde0ada14f72f9b" },
            });
        }

        // create dormitory
        const dormitory = new Dormitory({
            name,
            description,
            address,
            dormitoryImage,
            id_owner_Dormitory: userId,
        });

        await dormitory.save();
        res.status(201).json({ message: "Dormitory created successfully", dormitory });
    } catch (err) {
        res.status(500).json({ message: "Error creating dormitory", err: err.message });
    }
};

// update dormitory
exports.updateDormitory = async (req, res) => {
    const userId = req.userId;
    const { name, description, address, dormitoryImage } = req.body;
    const dormitoryId = req.params.id;

    // sanitize input เพื่อป้องกัน XSS
    const sanitizedData = {
        name: xss(String(name)),
        description: xss(String(description)),
        address: xss(String(address)),
        dormitoryImage: Array.isArray(dormitoryImage)
            ? dormitoryImage.map(img => xss(String(img)))
            : xss(String(dormitoryImage)),
    };

    // validate dormitoryId และ userId
    if (!validator.isMongoId(userId) || !validator.isMongoId(dormitoryId)) {
        return res.status(400).json({ message: "Invalid dormitory or user ID" });
    }

    try {
        const dormitory = await Dormitory.findById(dormitoryId);
        if (!dormitory) {
            return res.status(404).json({ message: "Dormitory not found" });
        }

        // ตรวจสอบเจ้าของหอพัก
        if (dormitory.id_owner_Dormitory.toString() !== userId) {
            return res.status(403).json({ message: "You are not the owner of this dormitory" });
        }

        // update dormitory
        dormitory.name = sanitizedData.name || dormitory.name;
        dormitory.description = sanitizedData.description || dormitory.description;
        dormitory.address = sanitizedData.address || dormitory.address;
        dormitory.dormitoryImage = sanitizedData.dormitoryImage || dormitory.dormitoryImage;

        await dormitory.save();
        res.status(200).json({ message: "Dormitory updated successfully", dormitory });
    } catch (err) {
        res.status(500).json({ message: "Error updating dormitory", err: err.message });
    }
};


// delete dormitory
exports.deleteDormitory = async (req, res) => {
  const userId = req.userId; // มาจาก verifyJWT
  const dormitoryId = req.params.id;

  try {
    const dormitory = await Dormitory.findById(dormitoryId);

    if (!dormitory) {
      return res.status(404).json({ message: "Dormitory not found" });
    }

    // Check if the user is the owner of the dormitory
    if (dormitory.id_owner_Dormitory.toString() != userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this dormitory" });
    }

    await dormitory.deleteOne();
    res.status(200).json({ message: "Dormitory deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting dormitory", err });
  }
};

// get all dormitories
exports.getAllDormitories = async (req, res) => {
  try {
    const dormitories = await Dormitory.find();
    res.status(200).json(dormitories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get dormitory by id
exports.getDormitoryById = async (req, res) => {
  try {
    const dormitory = await Dormitory.findById(req.params.id);
    if (!dormitory) {
      return res.status(404).json({ message: "Dormitory not found" });
    }
    res.status(200).json(dormitory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/dormitoriesController.js

exports.searchDormitories = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    console.log("searchTerm is", searchTerm);

    // ตรวจสอบว่า searchTerm เป็น string และไม่เป็นค่าว่าง
    if (!searchTerm || typeof searchTerm !== "string" || !searchTerm.trim()) {
      return res.status(400).json({ message: "Invalid search term" });
    }

    // ค้นหา Dormitory ตาม searchTerm
    const dormitories = await Dormitory.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } }, // ค้นหาชื่อหอพักที่คล้ายกัน
        { address: { $regex: searchTerm, $options: "i" } }, // ค้นหาที่อยู่ที่คล้ายกัน
      ],
    });

    // หากไม่พบหอพัก ส่งกลับ response ว่าง
    if (dormitories.length === 0) {
      return res.status(200).json({ filteredRooms: [] });
    }

    // ดึง ID ของ Dormitory ที่ค้นพบ
    const dormitoryIds = dormitories.map((dorm) => dorm._id);

    // ค้นหา Room ที่เชื่อมโยงกับ Dormitory เหล่านั้น
    const rooms = await Room.find({ id_dormitory: { $in: dormitoryIds } })
      .populate("id_dormitory", "name address dormitoryImage") // populate name, address, dormitoryImage จาก Dormitory
      .populate({
        path: "roomStatus", // เชื่อมกับ RoomStatus
        match: { status: "active" }, // กรองเฉพาะ roomStatus ที่เป็น 'Active'
      });

    // กรองเฉพาะห้องที่มี roomStatus เป็น Active และมี id_dormitory
    const filteredRooms = rooms.filter(
      (room) => room.roomStatus && room.id_dormitory
    );

    // ตรวจสอบว่ามีข้อมูลใน filteredRooms ก่อนการเข้าถึง
    if (filteredRooms.length > 0 && filteredRooms[0].id_dormitory) {
      console.log("test ", filteredRooms[0].id_dormitory.name);
    }

    //   console.log("filteredRooms is", filteredRooms);

    res.status(200).json({ filteredRooms });
  } catch (error) {
    console.error("error is", error);
    res.status(500).json({ message: error.message });
  }
};
