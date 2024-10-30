const mongoose = require('mongoose');

// Import Models
const Facility = require('./models/Facility');


require('dotenv').config();

const insert = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });

    const ListFacility = [
      { name : 'แอร์'},
      { name : 'พัดลม'},
      { name : 'เครื่องซักผ้า'},
      { name : 'เครื่องทำน้ำอุ่น'},
      { name : 'ตู้เย็น'},
      { name : 'เตียง'},
      { name : 'โต๊ะ'},
      { name : 'ทีวี'},
      { name : 'Wifi'},


    ];

    for (const facility of ListFacility) {
      const existingFacility = await Facility.findOne({ name: facility.name });
      if (!existingFacility) {
        await Facility.create(facility);
        console.log(`สร้าง facility: ${facility.name}`);
      } else {
        console.log(`facility มีอยู่แล้ว: ${facility.name}`);
      }
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการ Seed บทบาท:', err);
  }
};

insert();
