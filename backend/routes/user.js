const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const User = require("../models/user");

// /api/user/profile
router.get('/profile', protect, async (req, res) => {
  // console.log("📩 GET /profile route hit");
  // console.log("Authenticated user:", req.user?.email || req.user?._id);

  try {
    if (!req.user) {
      console.log("❌ No user found in request.");
      return res.status(404).json({ message: "User not found" });
    }
  
    // console.log("user profile route works")

    res.status(200).json({
      message: "User fetched successfully",

      user: req.user,
    });
  } catch (error) {
    console.error("❌ Error in /profile route:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Server error while fetching user profile" });
  }
});

// /api/user/profile/
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, branch, batch, email, linkedin, contact } = req.body;

    
    if (!name || !branch || !batch || !email) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: "Email already in use by another account." });
    }

    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        branch,
        batch,
        email,
        linkedin: linkedin || "",
        contact: contact || "",
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

module.exports = router; 

//protect does what we want here(attaches the user to the request by
// getting the token from header) thus we just return the user