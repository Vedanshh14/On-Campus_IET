// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// -----------------------
// ✅ POST /signup
// -----------------------
router.post('/signup', async (req, res) => {
  const {
    name,
    branch,
    batch,
    email,
    password,
    linkedin,
    contact
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    //can never get back original password from hashedpassword
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const newUser = new User({
      name,
      branch,
      batch,
      email,
      password: hashedPassword,
      linkedin,
      contact,
      
    });

    await newUser.save();

    // Generate JWT token
    // encoding only the id when we get this in token in future requests,
    // we can extract who the client is by this id.
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
    
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// -----------------------
// ✅ POST /login
// -----------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    // console.log('a');
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Check password
    //  console.log('b');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Generate token
    //  console.log('c');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      
    });
    //  console.log('d');
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      
    });
    //  console.log('e');

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

//RESET PASSWORD AS ADMIN FOR SOMEONE FROM POSTMAN
// POST /reset-password
router.post('/reset-pass-admin', async (req, res) => {
  const { email, newPassword, password_reset_key} = req.body;

  // Very basic admin authentication (don't expose this key publicly)
  if (password_reset_key !== process.env.PASSWORD_RESET_KEY)
    return res.status(403).json({ msg: 'Unauthorized' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: '✅ Password reset successfully' });
  } catch (error) {
    console.error('Reset Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});