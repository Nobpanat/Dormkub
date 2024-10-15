// import model Dormitory , User
const Dormitory = require('../models/Dormitory');
const User = require('../models/User');

// create dormitory
exports.createDormitory = async (req, res) => {
    const userId = req.userId;  // มาจาก verifyJWT
    const { name, description, address, dormitoryImage } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the user already has the role of dormitory owner
        if (!user.roles.includes("670ce4436fde0ada14f72f9b")) { // ตรวจสอบว่า roles ไม่มี role ของเจ้าของหอพัก
            await User.findByIdAndUpdate(userId, { $push: { roles: "670ce4436fde0ada14f72f9b" } });
        }

        // create dormitory
        const dormitory = new Dormitory({
            name,
            description,
            address,
            dormitoryImage,
            id_owner_Dormitory: userId
        });

        await dormitory.save();
        res.status(201).json({ message: 'Dormitory created successfully', dormitory });
    } catch (err) {
        res.status(500).json({ message: 'Error creating dormitory', err });
    }
};


// update dormitory
exports.updateDormitory = async (req, res) => {
    const userId = req.userId;  // มาจาก verifyJWT
    const { name, description, address, dormitoryImage } = req.body;
    const dormitoryId = req.params.id;

    try {
        const dormitory = await Dormitory.findById(dormitoryId);
        if(!dormitory){
            return res.status(403).json({ message: 'Dormitory not found' });
        } 

        // Check if the user is the owner of the dormitory
        if (dormitory.id_owner_Dormitory != userId) {
            return res.status(403).json({ message: 'You are not the owner of this dormitory' });
        }

        // update dormitory
        dormitory.name = name || dormitory.name;
        dormitory.description = description || dormitory.description;
        dormitory.address = address || dormitory.address;
        dormitory.dormitoryImage = dormitoryImage || dormitory.dormitoryImage;

        await dormitory.save();
        res.status(200).json({ message: 'Dormitory updated successfully', dormitory });
    } catch (err) {
        res.status(500).json({ message: 'Error updating dormitory', err });
    }
        
};


// delete dormitory
exports.deleteDormitory = async (req, res) => {
    const userId = req.userId;  // มาจาก verifyJWT
    const dormitoryId = req.params.id;

    try {
        const dormitory = await Dormitory.findById(dormitoryId);
        
        if(!dormitory){
            return res.status(404).json({ message: 'Dormitory not found' });
        }

        // Check if the user is the owner of the dormitory
        if (dormitory.id_owner_Dormitory.toString() != userId) {
            return res.status(403).json({ message: 'You are not the owner of this dormitory' });
        }

        await dormitory.deleteOne();
        res.status(200).json({ message: 'Dormitory deleted successfully' });

    } catch(err) {
        res.status(500).json({ message: 'Error deleting dormitory', err });
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
            return res.status(404).json({ message: 'Dormitory not found' });
        }
        res.status(200).json(dormitory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};