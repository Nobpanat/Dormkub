const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex'); // สร้าง key ความยาว 64 bytes (128 characters)
console.log(secretKey);