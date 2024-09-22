// routes/dormitories.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Dormitory = require('../models/Dormitory'); // นำเข้าโมเดล Dormitory
const User = require('../models/User'); // นำเข้าโมเดล User

// POST /api/dormitories: เพิ่มหอพักใหม่ (สำหรับเจ้าของหอพัก)
router.post('/', async (req, res) => {
  try {
    const[userExists] = await Promise.all([
      User.findById(req.body.ownerId)
    ]);// ตรวจสอบว่าผู้ใช้ที่ส่งคำขอมามีอยู่จริงหรือไม่

    if (!userExists) {
      return res.status(400).json({ message: 'Invalid ownerId' });
    }
    const newDormitory = new Dormitory(req.body);
    const savedDormitory = await newDormitory.save();

    // อัปเดตบทบาทของผู้ใช้เป็น 'owner'
    userExists.role = 'owner';
    await userExists.save();

    res.status(201).json(savedDormitory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/dormitories: ดึงรายการหอพักทั้งหมด
router.get('/', async (req, res) => {
  try {
    const dormitories = await Dormitory.find();
    res.status(200).json(dormitories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/dormitories/:id: ดึงข้อมูลหอพักตาม ID
router.get('/:id', async (req, res) => {
  try {
    const dormitory = await Dormitory.findById(req.params.id);
    if (!dormitory) {
      return res.status(404).json({ message: 'Dormitory not found' });
    }
    res.status(200).json(dormitory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/dormitories/:id: แก้ไขข้อมูลหอพัก (สำหรับเจ้าของหอพัก)
router.put('/:id', async (req, res) => {
  try {
    const [ownerExistes] = await Promise.all([
      User.findById(req.body.ownerId)
    ]);// ตรวจสอบว่าผู้ใช้ที่ส่งคำขอมามีอยู่จริงหรือไม่

    if (!ownerExistes) {
      return res.status(400).json({ message: 'Invalid ownerId' });
    }

    const updatedDormitory = await Dormitory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDormitory) {
      return res.status(404).json({ message: 'Dormitory not found' });
    }
    res.status(200).json(updatedDormitory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/dormitories/:id: ลบหอพัก (สำหรับเจ้าของหอพัก)
router.delete('/:id', async (req, res) => {
  try {
    const deletedDormitory = await Dormitory.findByIdAndDelete(req.params.id);
    if (!deletedDormitory) {
      return res.status(404).json({ message: 'Dormitory not found' });
    }
    res.status(200).json({ message: 'Dormitory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
