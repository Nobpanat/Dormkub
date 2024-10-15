const express = require('express');
const router = express.Router();

// import contractController
const contractController = require('../controllers/contractController');
const verifyJWT = require('../middleware/verifyJWT');

// POST /api/contracts: สร้างสัญญาใหม่
router.post('/',verifyJWT, contractController.createContract);

// // GET /api/contracts: ดึงรายการสัญญาทั้งหมด
router.get('/', verifyJWT ,contractController.getAllContracts);

// GET /api/contracts/:id: ดึงข้อมูลสัญญาตาม ID
router.get('/:id', verifyJWT ,contractController.getContractById);

// // PUT /api/contracts/:id: อัปเดตข้อมูลสัญญา
// router.put('/:id', contractController.updateContract);
  

// DELETE /api/contracts/:id: ลบสัญญา
router.delete('/:id', contractController.deleteContractById);

module.exports = router;
