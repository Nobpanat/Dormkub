// import models Transaction , Contract , User  , Dormitory 

const Transaction = require("../models/Transaction");
const Contract = require("../models/Contract");
const User = require("../models/User");
const Dormitory = require("../models/Dormitory");

// import Xendit
const { Xendit } = require("xendit-node");

// import uuidv4
const {v4 :uuidv4} = require('uuid');


// Initialize Xendit client
const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET });
const { Invoice } = xenditClient;



// function createInvoice
exports.createInvoice = async (req, res) => {
    try {
    
        const {
          contractId,
          payerId,
          payeeId,
          amount,
          type,
          status,
          currency,
        } = req.body;
    
        // ตรวจสอบความถูกต้องของ contractId, payerId, payeeId
        const [contractExists, payerExists, payeeExists] = await Promise.all([
          Contract.findById(contractId),
          User.findById(payerId),
          User.findById(payeeId),
        ]);
    
        const dormitoryExists = await Dormitory.findById(contractExists.dormitoryId);
    
        if (!contractExists || !payerExists || !payeeExists) {
          return res
            .status(400)
            .json({ error: "Invalid contractId, payerId, or payeeId" });
        }
    
        const externalId = uuidv4();
        
        // ข้อมูลการสร้าง invoice
        const invoiceData = {
          externalId, 
          amount,
          description: `Invoice for contract ${dormitoryExists.name}`,
          currency: "THB",
          "invoiceDuration": 86400, // กำหนดเวลาเริ่มต้นเป็น 1 วัน
          "reminderTime" : 1, // เตือนผู้ใช้ก่อนหมดเวลา 1 ชั่วโมง
        };
    
        // สร้าง invoice
        const invoice = await Invoice.createInvoice({ data: invoiceData });
        console.log(invoice);
    
        const idXendit = invoice.id;
    
        // สร้าง transaction เพื่อบันทึกข้อมูลการสร้าง invoice
        const newTransaction = new Transaction({
          contractId,
          payerId,
          payeeId,
          amount,
          type,
          status: 'pending',
          // invoiceUrl: invoice.invoice_url,
          currency,
          idXendit
        }); 
        await newTransaction.save();
    
        // รับ `invoice_url` จากการตอบกลับ
        const invoiceUrl = invoice.invoiceUrl;
        // ส่งกลับ URL สำหรับหน้าชำระเงิน
        res.json({ success: true, invoiceUrl });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
      }
}
