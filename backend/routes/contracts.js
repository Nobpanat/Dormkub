const express = require('express');
const router = express.Router();

// import contractController
const contractController = require('../controllers/contractsController');

// POST /api/contracts: สร้างสัญญาใหม่
router.post('/', contractController.addContract);

// GET /api/contracts: ดึงรายการสัญญาทั้งหมด
router.get('/', contractController.getAllContracts);

// GET /api/contracts/:id: ดึงข้อมูลสัญญาตาม ID
router.get('/:id', contractController.getContractById);

// PUT /api/contracts/:id: อัปเดตข้อมูลสัญญา
router.put('/:id', contractController.updateContract);
  

// DELETE /api/contracts/:id: ลบสัญญา
router.delete('/:id', contractController.deleteContract);

module.exports = router;
