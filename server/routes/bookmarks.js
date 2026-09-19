const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const Campaign = require('../models/Campaign');
const { verifyToken } = require('../middleware/auth');

// GET all bookmarked campaigns for current authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id })
      .populate({
        path: 'campaignId',
        model: 'Campaign'
      })
      .sort({ createdAt: -1 });

    // Filter out any bookmarks whose campaign might have been deleted
    const validBookmarks = bookmarks
      .filter((b) => b.campaignId != null)
      .map((b) => ({
        bookmarkId: b._id,
        savedAt: b.createdAt,
        campaign: b.campaignId
      }));

    res.json(validBookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET check if a specific campaign is bookmarked by current user
router.get('/check/:campaignId', verifyToken, async (req, res) => {
  try {
    const existing = await Bookmark.findOne({
      userId: req.user.id,
      campaignId: req.params.campaignId
    });

    res.json({ bookmarked: !!existing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST toggle bookmark for a campaign (add if absent, remove if present)
router.post('/:campaignId', verifyToken, async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const existing = await Bookmark.findOne({
      userId: req.user.id,
      campaignId
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({
        bookmarked: false,
        message: 'Campaign removed from saved'
      });
    }

    const newBookmark = new Bookmark({
      userId: req.user.id,
      userEmail: req.user.email,
      campaignId
    });

    await newBookmark.save();

    return res.status(201).json({
      bookmarked: true,
      message: 'Campaign saved to your favorites!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
