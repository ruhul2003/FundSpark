const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate bookmarks for the same user and campaign
bookmarkSchema.index({ userId: 1, campaignId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
