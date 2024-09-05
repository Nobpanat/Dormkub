const express = require('express');
const passport = require('passport');
const router = express.Router();

// POST /auth/google: ลงชื่อเข้าใช้หรือสมัครใหม่ด้วย Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard'); // หรือหน้าที่ต้องการหลังจากล็อกอิน
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
