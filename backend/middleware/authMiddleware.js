// middleware/authMiddleware.js
//basically does authentication and populates the user in req by user details
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const express = require('express');
const app = express();


const protect = async (req, res, next) => {
 
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Login first, No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
     
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = protect;