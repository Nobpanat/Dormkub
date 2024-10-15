// import Contract model
const Contract = require('../models/Contract');
const Room = require('../models/Room');
const ContractStatus = require('../models/ContractStatus');
const User = require('../models/User');

// Post /api/contracts : Create a new contract
exports.createContract = async (req, res) => {
    const userId = req.userId; // มาจาก verifyJWT
    const { id_owner_lessor, id_room, startDate, endDate, file_contract, description, contractStatus } = req.body;

    try{
        console.log("userId", userId);
        const tenant = await User.findById(userId);
        const owner = await User.findById(id_owner_lessor);
        const room = await Room.findById(id_room);
        const status = await ContractStatus.findById(contractStatus);
        console.log("tenant", tenant);
        console.log("owner", owner);
        console.log("room", room);
        console.log("status", status);

        if(!tenant || !owner || !room || !status){
            return res.status(400).json({ message: 'User, Owner, Room or Status not found' });
        }

        const contract = new Contract({
            id_owner_lessor: id_owner_lessor,
            id_tenant: userId,
            id_room: id_room,
            startDate: startDate,
            endDate: endDate,
            file_contract: file_contract,
            description: description,
            contractStatus: contractStatus
        });

        await contract.save();
        res.status(201).json({ message: 'Contract created successfully', contract });
    } catch (err) {
        res.status(500).json({ message: 'Error creating contract', err });
    }

};


// Get /api/contracts:id : Get contract by id
exports.getContractById = async (req,res) =>{
    const userId = req.userId; // มาจาก verifyJWT
    const contractId = req.params.id;
    try {
        const contract = await Contract.findById(contractId)
        .populate('id_owner_lessor' , '_id name email profileImage')
        .populate('id_tenant' , '_id name email profileImage')
        .populate('id_room' , '_id roomtype size rent deposit totalPrice')
        .populate('contractStatus' , '_id status');

        if(!contract){
            return res.status(404).json({ message: 'Contract not found' });
        }

        res.status(200).json(contract);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contract data', err });
    }

};

// Get /api/contracts : Get all contracts
// GET /api/contracts
exports.getAllContracts = async (req, res) => {
    const userId = req.userId;  // มาจาก verifyJWT
    // const role = req.userRole;  // สมมติว่ามี role ของ user มาจาก middleware เช่น ownerDormitory, tenant, หรือ previousTenant

    try {
        
        const user = await User.findById(userId).populate('roles');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }   

        let contracts = [];

        // ดึงสัญญาของผู้เช่า (id_tenant)
        if (user.roles.some( role => role.code === 'TENANT')) {
            contracts = await Contract.find({ id_tenant: userId })
                .populate('id_owner_lessor', '_id name email')
                .populate('id_tenant', '_id name email')
                .populate('id_room', '_id')
                .populate('contractStatus', '_id status');
        } 
        // ดึงสัญญาของเจ้าของหอพัก (id_owner_lessor)
        if (user.roles.some(role => role.code == 'OWNER_DORMITORY')) {
            contracts = await Contract.find({ id_owner_lessor: userId })
                .populate('id_owner_lessor', '_id name email')
                .populate('id_tenant', '_id name email')
                .populate('id_room', '_id totalPrice')
                .populate('contractStatus', '_id status');
        } 
        // ดึงสัญญาของผู้เช่ารายเก่า (จาก ContractForSale collection)
        // else if (role === 'previousTenant') {
        //     contracts = await ContractForSale.find({ id_previous_tenant: userId })
        //         .populate('id_previous_tenant', '_id name email')
        //         .populate('contractStatus', '_id status');
        // }

        if (!contracts || contracts.length === 0) {
            return res.status(404).json({ message: 'No contracts found' });
        }

        res.status(200).json({ contracts });

    } catch (err) {
        res.status(500).json({ message: 'Error fetching contracts', err });
    }
};

// Delete /api/contracts:id : Delete contract by id
exports.deleteContractById = async (req, res) => {
    
    const contractId = req.params.id;

    try {
        const contract = await Contract.findById(contractId);
        console.log("contract", contract);
        if(!contract){
            return res.status(404).json({ message: 'Contract not found' });
        }

        await Contract.findByIdAndDelete(contractId);
        res.status(200).json({ message: 'Contract deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting contract', err });
    }
};
