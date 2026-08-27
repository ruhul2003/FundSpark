const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Campaign = require('../models/Campaign');
const { verifyToken } = require('../middleware/auth');

// GET all comments for a specific campaign (Public)
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const comments = await Comment.find({ campaignId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a comment (Protected: logged in user)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { campaignId, text } = req.body;
    if (!campaignId || !text || !text.trim()) {
      return res.status(400).json({ message: 'Campaign ID and text are required.' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // Determine user role relative to this campaign (if user is creator of campaign)
    let role = req.user.role || 'supporter';
    if (campaign.creatorEmail === req.user.email) {
      role = 'creator';
    }

    const newComment = new Comment({
      campaignId,
      text: text.trim(),
      userEmail: req.user.email,
      userName: req.user.name || req.user.email.split('@')[0],
      userPhoto: req.user.photoURL || '',
      userRole: role
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a comment (Protected: comment owner or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.userEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this comment.' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
