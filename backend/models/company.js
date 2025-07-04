// models/company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  blogCount: {
    type: Number,
    default:0
  }
});

module.exports = mongoose.model('Company', companySchema);// models/company.js

