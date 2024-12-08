// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
// const cookieSession = require('cookie-session');
const session = require("express-session");
require("./config/passport-setup"); // นำเข้าไฟล์ตั้งค่า Passport
require("dotenv").config();
// const { Xendit } = require("xendit-node");

const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Xendit client
// const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET });
// const { Invoice } = xenditClient;

// ใช้ express-session 
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
app.use(
  cors({
    origin: "http://localhost:5173", // ระบุ URL ของ frontend "http://localhost:5173"
    credentials: true, // อนุญาตให้ส่งข้อมูลคุกกี้หรือ session
    // allowedHeaders: ["Content-Type", "Authorization"],
    // exposedHeaders:["Content-Security-Policy"],
  })
);


app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Sample Route for root URL
app.get("/", (req, res) => {
  res.send("API is running...");
});

// เรียกใช้ Route ที่สร้างไว้
// ทดสอบ get
const dormitoryRoutes = require("./routes/dormitories");
app.use("/api/dormitories", dormitoryRoutes);

// user
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

app.use("/api/users", userRoutes); // เส้นทางการจัดการผู้ใช้
app.use("/auth", authRoutes); // เส้นทางที่เกี่ยวกับการ authenticate

const contractRoutes = require("./routes/contracts");
app.use("/api/contracts", contractRoutes);

// Route สร้าง invoice
// app.post("/create-invoice", async (req, res) => {
//   try {
//     const invoiceData = {
//       "amount" : 10000,
//       "invoiceDuration" : 172800,
//       "externalId" : "test1234",
//       "description" : "Test Invoice",
//       "currency" : "THB",
//       "reminderTime" : 1
//     };

//     // สร้าง invoice
//     const invoice = await Invoice.createInvoice({ data: invoiceData });
//     console.log(invoice);
//     // รับ `invoice_url` จากการตอบกลับ
//     const invoiceUrl = invoice.invoiceUrl;
//     // ส่งกลับ URL สำหรับหน้าชำระเงิน
//     res.json({ success: true, invoiceUrl });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

const createInvoiceRoutes = require("./routes/createInvoice");
app.use("/api/create-invoice", createInvoiceRoutes);


// route booking
const bookingRoutes = require("./routes/bookings");
app.use("/api/bookings", bookingRoutes);

// route room
const roomRoutes = require("./routes/rooms");
app.use("/api/rooms", roomRoutes);

// route facility
const facilityRoutes = require("./routes/facilities");
app.use("/api/facilities", facilityRoutes);

app.get('/api/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  // console.log('imageUrl:', imageUrl);

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://lh3.googleusercontent.com',
      },
    });

    // console.log('Response status:', response.status);

    // ดึง Headers ทั้งหมดในรูปแบบ JSON
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image, status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // ใช้ Content-Type จาก Response
    res.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});





// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

