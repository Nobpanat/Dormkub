// routes/dormitories.js
const express = require('express');
const router = express.Router();

const dormitoriesController = require('../controllers/dormitoriesController');


// GET /api/dormitories/search: ค้นหาหอพัก
router.get('/search' , dormitoriesController.searchDormitories);

// POST /api/dormitories: เพิ่มหอพักใหม่ (สำหรับเจ้าของหอพัก)
router.post('/', dormitoriesController.addDormitory);

// GET /api/dormitories: ดึงรายการหอพักทั้งหมด
router.get('/', dormitoriesController.getAllDormitories);

// GET /api/dormitories/:id: ดึงข้อมูลหอพักตาม ID
router.get('/:id', dormitoriesController.getDormitoryById);

// PUT /api/dormitories/:id: แก้ไขข้อมูลหอพัก (สำหรับเจ้าของหอพัก)
router.put('/:id', dormitoriesController.updateDormitory);

// DELETE /api/dormitories/:id: ลบหอพัก (สำหรับเจ้าของหอพัก)
router.delete('/:id', dormitoriesController.deleteDormitory);

module.exports = router;
