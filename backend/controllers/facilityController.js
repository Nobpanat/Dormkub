// import Facility model and FacilityList model
const Facility = require('../models/Facility');
const FacilityList = require('../models/FacilityList');
const Room = require('../models/Room');
const User = require('../models/User');
const Contract = require('../models/Contract');


// createFacilityList function to create a list of facilities
exports.createFacilityList = async (req, res) => {
  try {
    // console.log(req.body);
    const userId = req.userId; // มาจาก JWT
    // console.log(userId);
    const {id_room , facilities } = req.body;

    // check if the user is an owner of room
    const user = await User.findById(userId);
    const room = await Room.findById(id_room);
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
    if(room.id_owner_room != userId){
      return res.status(403).json({ message: 'คุณไม่ใช่เจ้าของห้องนี้' });
    }

    // check facilities id from facility
    for (const facilityId of facilities) {
      const facility = await Facility.findById(facilityId);
      if (!facility) {
        return res.status(404).json({ message: 'ไม่พบสิ่งอำนวยความสะดวก' });
      }
    }

    const facilityList = new FacilityList({
      facilities: facilities
    });

    await facilityList.save();
    res.status(201).json({ message: 'สร้างรายการสิ่งอำนวยความสะดวกสำเร็จ', facilityList });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// createFacility function to create a facility
exports.createFacilityListContract = async (req, res) => {
  try {
    const userId = req.userId; // มาจาก JWT
    const {id_contract , facilities} = req.body;

    // check if the user is an owner of contract
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    // check the user is the owner of the contract
    const contract = await Contract.findById(id_contract);
    if(contract.id_owner_lessor != userId){
      return res.status(403).json({ message: 'คุณไม่ใช่เจ้าของสัญญานี้' });
    }

    // check facilities id from facility
    for (const facilityId of facilities) {
      const facility = await Facility.findById(facilityId);
      if (!facility) {
        return res.status(404).json({ message: 'ไม่พบสิ่งอำนวยความสะดวก' });
      }
    }

    const facility = new Facility({
      facilities: facilities
    });

    await facility.save();
    res.status(201).json({ message: 'สร้างสิ่งอำนวยความสะดวกสำเร็จ', facility });

  }catch (err) {
    res.status(400).json({ message: err.message });
  }

};