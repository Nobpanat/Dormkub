const express = require("express");
const router = express.Router();

// import create-invoiceController
const createInvoiceController = require("../controllers/createInvoiceController");


const verifyJWT = require('../middleware/verifyJWT');

// Route สร้าง invoice
// POST /api/create-invoice
router.post("/",verifyJWT,createInvoiceController.createInvoice );


module.exports = router;
