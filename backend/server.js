// Load environment variables
require('dotenv').config();

// Core dependencies
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Create app instance
const app = express();

// -------------------
// 🔧 Middleware Setup
// -------------------
app.use(express.json()); // To parse incoming JSON requests
app.use(cookieParser()); // To handle JWT cookies

// --------------------
// 🔗 Database Connection
// --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ----------------
// 📁 Route Imports
// ----------------
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes)

// ------------------
// 🚪 API Route Setup
// ------------------
app.use('/api/auth', authRoutes); // All auth routes go through this prefix

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ---------------------
// 🚀 Start the Backend
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});