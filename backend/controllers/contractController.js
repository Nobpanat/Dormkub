// import Contract model
const Contract = require("../models/Contract");
const Room = require("../models/Room");
const ContractStatus = require("../models/ContractStatus");
const User = require("../models/User");
const Facility = require("../models/Facility");
const FacilityList = require("../models/FacilityList");
// validate and sanitize user input data and protect xss attack
const validator = require("validator");
const xss = require("xss");


function sanitizeContractData(data) {
  return {
    startDate: data.startDate ? validator.toDate(data.startDate) : null,
    endDate: data.endDate ? validator.toDate(data.endDate) : null,
    fileContract: data.file_contract ? xss(data.file_contract) : "",
    description: data.description ? xss(data.description) : "",
    roomImage: Array.isArray(data.roomImage) ? data.roomImage.map((img) => xss(img)) : [],
    dormitoryName: data.DormitoryName ? xss(data.DormitoryName) : "",
    rent: data.rent ? parseFloat(data.rent) : 0,
    deposit: data.deposit ? parseFloat(data.deposit) : 0,
    totalPrice: data.totalPrice ? parseFloat(data.totalPrice) : 0,
    address: data.address ? xss(data.address) : "",
    facilities: Array.isArray(data.facilities) ? data.facilities.map((facility) => validator.escape(facility)) : [],
    roomType: data.roomType ? xss(data.roomType) : "",
    size: data.size ? parseFloat(data.size) : 0,
  };
}

// Post /api/contracts : Create a new contract
// Function to create a contract
exports.createContract = async (req, res) => {
  const userId = req.userId;
  const contractStatus = "670e13f8c2bb7a6bc17215ac"; // active status

  try {
    // Clean and validate input data
    const {
      startDate,
      endDate,
      fileContract,
      description,
      roomImage,
      dormitoryName,
      rent,
      deposit,
      totalPrice,
      address,
      facilities,
      roomType,
      size,
    } = sanitizeContractData(req.body);

    // Check numeric values
    if (isNaN(rent) || isNaN(deposit) || isNaN(totalPrice)) {
      return res.status(400).json({
        message: "Invalid numeric values for rent, deposit, or totalPrice",
      });
    }

    const ownerContract = await User.findById(userId);
    const status = await ContractStatus.findById(contractStatus);
    if (!ownerContract || !status)
      return res
        .status(400)
        .json({ message: "User, Owner or Status not found" });

    if (!ownerContract.roles.includes("670ce4436fde0ada14f72f9e")) {
      await User.findByIdAndUpdate(userId, {
        $push: { roles: "670ce4436fde0ada14f72f9e" },
      });
    }

    // Check facilities
    for (const facilityId of facilities) {
      const facility = await Facility.findById(facilityId);
      if (!facility)
        return res.status(404).json({ message: "Facility not found" });
    }

    const facilityList = new FacilityList({ facilities });

    const contract = new Contract({
      id_owner_lessor: userId,
      startDate,
      endDate,
      file_contract: fileContract,
      description,
      contractStatus,
      roomImage,
      DormitoryName: dormitoryName,
      rent,
      deposit,
      totalPrice,
      address,
      id_facilityList: facilityList._id,
      roomType,
      size,
    });

    facilityList.contractId = contract._id;
    await facilityList.save();
    await contract.save();
    res.status(201).json({
      message: "Contract created successfully",
      contract,
      facilityList,
    });
  } catch (err) {
    console.error("Contract Creation Error:", err);
    res.status(500).json({ message: "Error creating contract", err });
  }
};

// Get /api/contracts:id : Get contract by id
exports.getContractById = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findById(id)
      .populate({
        path: "id_owner_lessor",
        select: "-email -googleId",
      })
      .populate("contractStatus", "_id status")
      .populate({
        path: "id_facilityList",
        populate: {
          path: "facilities",
          model: "Facility",
          select: "_id name",
        },
      })
      .select("-file_contract");

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json(contract);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contract data", err });
  }
};

// Get /api/contracts : Get all contracts of User
// GET /api/contracts
exports.getAllContracts = async (req, res) => {
  const userId = req.userId; // มาจาก verifyJWT

  try {
    // ดึงเฉพาะสัญญาที่มี id_owner_lessor ตรงกับ userId
    const contracts = await Contract.find({ id_owner_lessor: userId })
      .populate("id_owner_lessor", "_id name email")
      .populate("contractStatus", "_id status");

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({ message: "No contracts found" });
    }

    res.status(200).json({ contracts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching contracts", err });
  }
};


// Delete /api/contracts:id : Delete contract by id
exports.deleteContractById = async (req, res) => {
  const contractId = req.params.id;

  try {
    const contract = await Contract.findById(contractId);
    console.log("contract", contract);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    await Contract.findByIdAndDelete(contractId);
    res.status(200).json({ message: "Contract deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting contract", err });
  }
};

// Get all contract for homePage
exports.getAllContract = async (req, res) => {
  try {
    const contracts = await Contract.find()
      .populate({
        path: "contractStatus",
        match: { status: "active" },
      })
      .select("-file_contract");

    const filteredContracts = contracts.filter(
      (contract) => contract.contractStatus
    );

    res.status(200).json(filteredContracts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contract data", err });
  }
};


// PUT /api/contracts/:id : Update contract by id
exports.updateContract = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Clean and validate input data
    const {
      startDate,
      endDate,
      fileContract,
      description,
      roomImage,
      dormitoryName,
      rent,
      deposit,
      totalPrice,
      address,
      facilities,
      roomType,
      size,
    } = sanitizeContractData(req.body);

    // Check numeric values
    if (isNaN(rent) || isNaN(deposit) || isNaN(totalPrice)) {
      return res.status(400).json({
        message: "Invalid numeric values for rent, deposit, or totalPrice",
      });
    }

    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    if (contract.id_owner_lessor.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check facilities
    for (const facilityId of facilities) {
      const facility = await Facility.findById(facilityId);
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }
    }

    const facilityList = await FacilityList.findById(contract.id_facilityList);
    facilityList.facilities = facilities;
    await facilityList.save();

    contract.startDate = startDate;
    contract.endDate = endDate;
    contract.file_contract = fileContract;
    contract.description = description;
    contract.roomImage = roomImage;
    contract.DormitoryName = dormitoryName;
    contract.rent = rent;
    contract.deposit = deposit;
    contract.totalPrice = totalPrice;
    contract.address = address;
    contract.roomType = roomType;
    contract.size = size;

    await contract.save();
    res.status(200).json({ message: "Contract updated successfully", contract });
  } catch (err) {
    console.error("Error updating contract:", err);
    res.status(500).json({ message: "Error updating contract", err });
  }
};
