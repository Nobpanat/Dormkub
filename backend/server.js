// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
// const cookieSession = require('cookie-session');
const session = require('express-session');
require('./config/passport-setup'); // นำเข้าไฟล์ตั้งค่า Passport
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// console.log(process.env.GOOGLE_CLIENT_ID);

// ใช้ express-session แทน cookie-session
app.use(
  session({
    secret: process.env.COOKIE_KEY, // ใช้ secret key จาก .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // อายุ cookie 1 วัน
  })
);


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Sample Route for root URL
app.get('/', (req, res) => {
  res.send('API is running...');
});

// เรียกใช้ Route ที่สร้างไว้
// ทดสอบ get
const dormitoryRoutes = require('./routes/dormitories');
app.use('/api/dormitories', dormitoryRoutes);


// user
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

app.use('/api/users', userRoutes); // เส้นทางการจัดการผู้ใช้
app.use('/auth', authRoutes); // เส้นทางที่เกี่ยวกับการ authenticate

const contractRoutes = require('./routes/contracts');
app.use('/api/contracts', contractRoutes);


// Routes สำหรับ Google Login
// app.get('/auth/google',passport.authenticate('google', {
//     scope: ['profile', 'email'],
//   })
// );

// app.get('/auth/google/callback',passport.authenticate('google'),
//   (req, res) => {
//     // หลังจากล็อกอินสำเร็จ ส่งกลับไปที่หน้า Home หรือหน้าอื่น ๆ
//     res.redirect('/dashboard');
//   }
// );

// Route สำหรับ Logout
// app.get('/auth/logout', (req, res) => {
// req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect('/');
//   });
// });

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
