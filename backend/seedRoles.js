// seedRoles.js

const mongoose = require('mongoose');
const Role = require('./models/Role'); // ปรับเส้นทางให้ถูกต้องตามโครงสร้างโปรเจกต์ของคุณ
require('dotenv').config();

const seedRoles = async () => {
  try {
    console.log("mongo uri", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });

    const roles = [
      { code: 'TENANT', role: 'tenant' },
      { code: 'OWNER_DORMITORY', role: 'ownerDormitory' },
      { code: 'OWNER_CONTRACT', role: 'ownerContract' }
    ];

    for (const roleData of roles) {
      const existingRole = await Role.findOne({ code: roleData.code });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(`สร้างบทบาทสำเร็จ: ${roleData.role}`);
      } else {
        console.log(`บทบาทมีอยู่แล้ว: ${roleData.role}`);
      }
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการ Seed บทบาท:', err);
  }
};

seedRoles();
