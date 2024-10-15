// import models user and dormitory and contract
const User = require('../models/User');
const Dormitory = require('../models/Dormitory');
const Contract = require('../models/Contract');

// function addContract
exports.addContract = async (req, res) => {
    try {
        const { tenantId, ownerId, dormitoryId, startDate, endDate, price, deposit ,status , totalPrice,type } = req.body;
    
        // ตรวจสอบความถูกต้องของ tenantId, ownerId, dormitoryId
        const [tenantExists, ownerExists, dormitoryExists] = await Promise.all([
          User.findById(tenantId),
          User.findById(ownerId),
          Dormitory.findById(dormitoryId)
        ]);
    
        if (!tenantExists || !ownerExists || !dormitoryExists) {
          return res.status(400).json({ 
            error: 'Invalid tenantId, ownerId, or dormitoryId'
          });
        }
    
        // สร้างสัญญาใหม่
        const newContract = new Contract({
          dormitoryId,
          ownerId,
          tenantId,
          startDate,
          endDate,
          status,
          price,
          deposit,
          totalPrice,
          type
        });
        const savedContract = await newContract.save();
        
        return res.status(201).json(savedContract);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
};

// function getAllContracts
exports.getAllContracts = async (req, res) => {
    try {
        const contracts = await Contract.find()
          .populate('tenantId ownerId dormitoryId');
        
        return res.status(200).json(contracts);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
}

// function getContractById
exports.getContractById = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id)
          .populate('tenantId ownerId dormitoryId');
    
        if (!contract) {
          return res.status(404).json({ error: 'Contract not found' });
        }
    
        return res.status(200).json(contract);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
};

// function updateContract
exports.updateContract = async (req, res) => {
    try {
        const { startDate, endDate, ...restData } = req.body;
    
        // ค้นหา contract โดย id
        const contract = await Contract.findById(req.params.id);
    
        if (!contract) {
          return res.status(404).json({ error: 'Contract not found' });
        }
    
        // อัปเดตค่าที่ได้รับ
        if (startDate) {
          contract.startDate = startDate;
        }
        if (endDate) {
          contract.endDate = endDate;
        }
    
        // อัปเดตข้อมูลอื่น ๆ ที่เหลือ
        Object.assign(contract, restData);
    
        // บันทึกข้อมูลใหม่
        const updatedContract = await contract.save();
        
        res.status(200).json(updatedContract);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
};

// function deleteContract
exports.deleteContract = async (req, res) => {
    try {
        const deletedContract = await Contract.findByIdAndDelete(req.params.id);
    
        if (!deletedContract) {
          return res.status(404).json({ error: 'Contract not found' });
        }
    
        return res.status(200).json({ message: 'Contract deleted successfully' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};