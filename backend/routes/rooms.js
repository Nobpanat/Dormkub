// routes/rooms.js
const express = require('express');
const router = express.Router();

// import room controller
const roomController = require('../controllers/roomController');
const verifyJWT = require('../middleware/verifyJWT');

// POST /api/rooms/ สร้างห้องใหม่ (สำหรับเจ้าของหอพัก)
router.post('/', verifyJWT, roomController.createRoom);

// PUT /api/rooms/:id: แก้ไขข้อมูลห้อง (สำหรับเจ้าของหอพัก)
router.put('/:id', verifyJWT, roomController.updateRoom);

// GET /api/rooms/:id: ดึงข้อมูลห้องตาม ID
router.get('/:id', roomController.getRoomById);

// GET /api/rooms/ ดึงรายการห้องทั้งหมด
router.get('/', roomController.getAllRooms);

// DELETE /api/rooms/:id: ลบห้อง (สำหรับเจ้าของหอพัก)
router.delete('/:id', verifyJWT, roomController.deleteRoomById);

// PUT /api/rooms/ updateRoomStatus
router.put('/updateRoomStatus/:id', verifyJWT, roomController.updateRoomStatus);

// GET /api/rooms/getAll/SuggestRooms
router.get('/getAll/SuggestRooms', roomController.getAllSuggestRooms);

module.exports = router;