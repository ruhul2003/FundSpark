const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    toEmail: { type: String, required: true, lowercase: true },
    actionRoute: { type: String, default: '/dashboard' },
    isRead: { type: Boolean, default: false },
    time: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
