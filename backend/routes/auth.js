const express = require('express');
const router = express.Router();

// import auth controller
const authController = require('../controllers/authController');

const verifyJWT = require('../middleware/verifyJWT'); 

// POST /auth/google: ลงชื่อเข้าใช้หรือสมัครใหม่ด้วย Google
router.get('/google', authController.authGoogle);

// Google OAuth callback
router.get('/google/callback', authController.authGoogleCallback);


// Logout
router.post('/logout', authController.logout);

module.exports = router;
