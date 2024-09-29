// controllers/authController.js
// import jwtwebtoken
const jwt = require('jsonwebtoken');


const passport = require('passport');

// function auth with google
exports.authGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

// function auth with google callback redirect to dashboard
exports.authGoogleCallback = [
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      if (!req.user) {
        return res.status(400).json({ message: 'User not found after Google authentication' });
      }
  
      // ถ้าเข้าสู่ระบบสำเร็จ สร้าง JWT
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      // ส่ง JWT ใน HTTP-only, Secure cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      // Redirect ไปที่หน้า dashboard
      res.redirect('http://localhost:5173');
    }
  ];
  

// function logout
exports.logout = (req, res) => {
  console.log('logout requested');
  
  // ทำการออกจากระบบใน passport session
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during logout' });
    }

    // ลบ JWT
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  });
};
