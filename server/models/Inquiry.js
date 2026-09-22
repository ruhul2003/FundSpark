const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      enum: [
        'General Inquiry',
        'Backer & Credits',
        'Campaign Verification',
        'Creator Support',
        'Technical Issue',
        'Partnership'
      ],
      default: 'General Inquiry'
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in-review', 'resolved'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'urgent'],
      default: 'normal'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    responseNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
