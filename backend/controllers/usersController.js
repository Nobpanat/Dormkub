// controllers/usersController.js

const User = require('../models/User');

exports.getUserByIdFromToken = async (req, res) => {
    try {
      const user = await User.findById(req.userId); 
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user data' });
    }
};

exports.updateUserById =  async (req, res) => {
    const {name , profileImage} = req.body;
    const userId = req.userId;  // มาจาก verifyJWT
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, 
        {name , profileImage}, 
        {new: true,}
    );
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: 'Error updating user data',err });
    }
};

exports.deleteUserById = async (req, res) => {
    const userId = req.userId;  // มาจาก verifyJWT

    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if(!deletedUser) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting user' ,err});
    }
};