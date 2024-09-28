const jwt = require('jsonwebtoken');


const verifyJWT = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]; // อ่าน JWT จาก cookies หรือ headers
  
    if (!token) {
      return res.status(403).json({ message: 'Token not provided' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      req.userId = decoded.userId; // บันทึก userId จาก token
      next();
    });
  };
  
module.exports = verifyJWT;
  