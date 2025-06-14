// models/company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('Company', companySchema);// models/company.js

