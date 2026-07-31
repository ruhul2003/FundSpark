const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

// GET notifications for logged in user (matched by toEmail, sorted descending by time)
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      toEmail: req.user.email.toLowerCase()
    }).sort({ time: -1, createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH Mark all notifications as read for logged in user
router.patch('/read-all', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { toEmail: req.user.email.toLowerCase(), isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
