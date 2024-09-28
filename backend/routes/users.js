// routes/users.js
const express = require('express');
const router = express.Router();

// import user controller
const usersController = require('../controllers/usersController');

// GET /api/users/:id: ดึงข้อมูลผู้ใช้ตาม ID
router.get('/:id', usersController.getUserById);

// PUT /api/users/:id: อัปเดตข้อมูลผู้ใช้
router.put('/:id', usersController.updateUserById);

// DELETE /api/users/:id: ลบผู้ใช้
router.delete('/:id', usersController.deleteUserById);  

module.exports = router;
