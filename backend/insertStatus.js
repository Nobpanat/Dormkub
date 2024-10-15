const mongoose = require('mongoose');

// Import Models
const BookingStatus = require('./models/BookingStatus');
const RoomStatus = require('./models/RoomStatus');
const ContractStatus = require('./models/ContractStatus');


require('dotenv').config();

const insertRoles = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });

    const ListStatus = [
      { code: 'ACTIVE', status: 'active' },
      { code: 'PENDING', status: 'pending' },
      { code: 'RENT', status: 'rent' },
      { code: 'TERMINATED', status: 'terminated' }
    ];

    for (const statusData of ListStatus) {
      const existingStatus = await ContractStatus.findOne({ status: statusData.code });
      if (!existingStatus) {
        await ContractStatus.create(statusData);
        console.log(`สร้างสถานะสำเร็จ: ${statusData.status}`);
      } else {
        console.log(`สถานะมีอยู่แล้ว: ${statusData.status}`);
      }
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการ Seed บทบาท:', err);
  }
};

insertRoles();
