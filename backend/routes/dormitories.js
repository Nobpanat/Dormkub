// routes/dormitories.js
const express = require('express');
const router = express.Router();

const dormitoryController = require('../controllers/dormitoryController');
const verifyJWT = require('../middleware/verifyJWT');


// GET /api/dormitories/search: ค้นหาหอพัก
// router.get('/search' , dormitoriesController.searchDormitories);

// POST /api/dormitories: เพิ่มหอพักใหม่ (สำหรับเจ้าของหอพัก)
router.post('/', verifyJWT,  dormitoryController.createDormitory);

// // GET /api/dormitories: ดึงรายการหอพักทั้งหมด
router.get('/', dormitoryController.getAllDormitories);

// // GET /api/dormitories/:id: ดึงข้อมูลหอพักตาม ID
router.get('/:id', dormitoryController.getDormitoryById);

// PUT /api/dormitories/:id: แก้ไขข้อมูลหอพัก (สำหรับเจ้าของหอพัก)
router.put('/:id', verifyJWT , dormitoryController.updateDormitory);

// // DELETE /api/dormitories/:id: ลบหอพัก (สำหรับเจ้าของหอพัก)
router.delete('/:id',verifyJWT, dormitoryController.deleteDormitory);

// POST /api/dorm/search: ค้นหาหอพัก
router.get('/dorm/search', dormitoryController.searchDormitories);

module.exports = router;
