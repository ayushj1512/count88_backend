const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    organisationName: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    queryType: {
      type: String,
      required: true,
      enum: ['Bulk Purchase', 'Reseller', 'Partnership', 'Custom Requirement', 'Others'],
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Resolved', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', querySchema);
