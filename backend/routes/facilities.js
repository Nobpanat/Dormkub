// routes/facilities.js
const express = require('express');
const router = express.Router();

// import facility controller
const facilityController = require('../controllers/facilityController');
const verifyJWT = require('../middleware/verifyJWT');

// POST /api/facilities/ สร้างสิ่งอำนวยความสะดวก (สำหรับเจ้าของห้อง)
router.post('/', verifyJWT, facilityController.createFacilityList);

module.exports = router;