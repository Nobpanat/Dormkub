const express = require('express');
const router = express.Router();

// import contractController
const contractController = require('../controllers/contractController');
const verifyJWT = require('../middleware/verifyJWT');

// POST /api/contracts: สร้างสัญญาใหม่
router.post('/',verifyJWT, contractController.createContract);

// // GET /api/contracts: ดึงรายการสัญญาทั้งหมดหน้า homePage
router.get('/',contractController.getAllContract);

// GET /api/contracts/:id: ดึงข้อมูลสัญญาตาม ID
router.get('/:id' ,contractController.getContractById);

// GET /api/contracts/ : ดึงรายการสัญญาทั้งหมดสำหรับเจ้าของหอพัก
router.get('/getAll/contract', verifyJWT, contractController.getAllContracts);

// PUT /api/contracts/:id: อัปเดตข้อมูลสัญญา
router.put('/:id', verifyJWT, contractController.updateContract);

// DELETE /api/contracts/:id: ลบสัญญา
router.delete('/:id', verifyJWT, contractController.deleteContractById);



// // PUT /api/contracts/:id: อัปเดตข้อมูลสัญญา
// router.put('/:id', contractController.updateContract);
  

// DELETE /api/contracts/:id: ลบสัญญา
router.delete('/:id', contractController.deleteContractById);

module.exports = router;
