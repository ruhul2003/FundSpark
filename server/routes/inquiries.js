const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { verifyToken, checkRole } = require('../middleware/auth');

// POST submit a support inquiry or message (Public / Authenticated optional)
router.post('/', async (req, res) => {
  try {
    const { name, email, category, subject, message, priority, userId } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const newInquiry = new Inquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category || 'General Inquiry',
      subject: subject.trim(),
      message: message.trim(),
      priority: priority || 'normal',
      userId: userId || null
    });

    await newInquiry.save();

    res.status(201).json({
      message: 'Your inquiry has been received! Our support team will review and contact you shortly.',
      ticketId: newInquiry._id,
      inquiry: newInquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all inquiries (Admin only)
router.get('/', verifyToken, checkRole(['Admin', 'admin']), async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update inquiry status & notes (Admin only)
router.put('/:id/status', verifyToken, checkRole(['Admin', 'admin']), async (req, res) => {
  try {
    const { status, responseNotes } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    if (status) inquiry.status = status;
    if (responseNotes !== undefined) inquiry.responseNotes = responseNotes;

    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
