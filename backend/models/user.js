// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String, enum: ['CSE','CSBS', 'IT', 'ETC', 'EI', 'Mech', 'Civil'], required: true },
  batch: { type: Number, required: true },
  linkedin: { type: String },
  contact: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);