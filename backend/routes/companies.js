const express = require('express');
const router = express.Router();
const Company = require('../models/company');
// GET /api/companies/all
router.get('/all', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 }); // alphabetically sorted
    const companyNames = companies.map(c => c.name);
    res.status(200).json({
      message: 'Company names fetched successfully',
      companies: companyNames
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Server error while fetching company names' });
  }
});

module.exports = router;