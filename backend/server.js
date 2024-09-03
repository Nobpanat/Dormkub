// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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
const dormitoryRoutes = require('./routes/dormitories');
app.use('/api/dormitories', dormitoryRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
