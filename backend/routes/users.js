// routes/users.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/google: ลงชื่อเข้าใช้หรือสมัครใหม่ด้วย Google
// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // Google OAuth callback
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/'); // เปลี่ยน path ตามที่ต้องการหลังจากล็อกอินสำเร็จ
//   }
// );

// // logut session 
// router.get('/logout', (req, res) => {
//     req.logout((err) => {
//       if (err) {
//         return next(err);
//       }
//       res.redirect('/');
//     });
//   });
  

// GET /api/users/:id: ดึงข้อมูลผู้ใช้ตาม ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// PUT /api/users/:id: อัปเดตข้อมูลผู้ใช้
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user data' });
  }
});

// DELETE /api/users/:id: ลบผู้ใช้
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
