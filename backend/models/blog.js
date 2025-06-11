const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postAsAnonymous: {
    type: Boolean,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  campusType: {
    type: String,
    enum: ['on-campus', 'off-campus'],
    required: true
  },
  arrivedInSem: {
    type: Number,
    enum: [4, 5, 6, 7, 8],
  },
  cgpaCriteria: {
    type: Number,
    enum: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9]
  },
  packageIntern: String,
  packageFullTime: String,
  selectionStatus: {
    type: String,
    enum: ['selected', 'notselected'],
    required: true
  },
  experience: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);

