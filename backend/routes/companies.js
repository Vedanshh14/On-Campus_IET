const express = require("express");
const router = express.Router();
const Company = require("../models/company");
// GET /api/companies/all
router.get("/all", async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 }); // alphabetically sorted
    const companyNames = companies.map((c) => c.name);
    res.status(200).json({
      message: "Company names fetched successfully",
      companies: companyNames,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching company names" });
  }
});

// POST /api/companies/add
router.post('/add', async (req, res) => {
  try {
    const { name } = req.body;  // ✅ extract 'name' string from req.body

    const new_name = name?.trim();  // optional chaining in case name is undefined

    if (!new_name) {
      return res.status(400).json({ message: "Company name can't be empty" });
    }

    // Check if company already exists (case-insensitive)
    const existing = await Company.findOne({
      name: { $regex: new RegExp(`^${new_name}$`, "i") },
    });

    if (existing) {
      return res.status(400).json({ message: "Company already exists" });
    }

    const newCompany = new Company({ name: new_name });
    await newCompany.save();

    res.status(201).json({
      message: "Company added successfully.",
      company: newCompany.name,
    });
  } catch (err) {
    console.error("Error adding company:", err);
    res.status(500).json({ message: "Server error while adding company." });
  }
});

module.exports = router;
