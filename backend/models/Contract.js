const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  dormitoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dormitory', 
    required: [true, 'Dormitory ID is required'] // เพิ่มข้อความ error
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Owner ID is required'] 
  },
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Tenant ID is required'] 
  },
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required'],
    validate: { 
      validator: function(value) {
        console.log('Start Date:', value, 'End Date:', this.endDate);     //debug
        return value instanceof Date && value < this.endDate; // ตรวจสอบว่า startDate ต้องมาก่อน endDate
      },
      message: 'Start date must be before end date'
    }
  },
  endDate: { 
    type: Date, 
    required: [true, 'End date is required'] 
  },
  status: { 
    type: String, 
    enum: ['active', 'subleased', 'terminated'], 
    default: 'active',
    required: [true, 'Status is required'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'] // ตรวจสอบว่า price ต้องเป็นตัวเลขบวก
  },
  deposit: { 
    type: Number, 
    default: 0,
    min: [0, 'Deposit must be a positive number'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true, // เปิดใช้งาน timestamps (createdAt และ updatedAt จะถูกจัดการให้อัตโนมัติ)
  collection: 'Contract'
});

// Middleware: อัปเดต updatedAt ทุกครั้งที่มีการแก้ไขข้อมูล
contractSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Contract', contractSchema);
