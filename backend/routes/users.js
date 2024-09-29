// routes/users.js
const express = require('express');
const router = express.Router();

// import user controller
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');   

// GET /api/users/profile
router.get('/profile',verifyJWT, usersController.getUserByIdFromToken);

// PUT /api/users/:id: อัปเดตข้อมูลผู้ใช้
router.put('/:id', usersController.updateUserById);

// DELETE /api/users/:id: ลบผู้ใช้
router.delete('/:id', usersController.deleteUserById);  

module.exports = router;
