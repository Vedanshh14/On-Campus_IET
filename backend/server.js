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

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

//signup,login,password reset routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes)

//post, delete or update a blog
const blogRoutes = require('./routes/blog');
app.use('/api/blog', blogRoutes);



// ---------------------
// 🚀 Start the Backend
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});