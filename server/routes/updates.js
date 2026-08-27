const express = require('express');
const router = express.Router();
const CampaignUpdate = require('../models/CampaignUpdate');
const Campaign = require('../models/Campaign');
const { verifyToken } = require('../middleware/auth');

// GET all updates for a specific campaign (Public)
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updates = await CampaignUpdate.find({ campaignId }).sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a campaign update (Protected: creator of campaign or admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { campaignId, title, content } = req.body;
    if (!campaignId || !title || !content) {
      return res.status(400).json({ message: 'Campaign ID, title, and content are required.' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // Check if user is creator of campaign or admin
    if (campaign.creatorEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the campaign creator or an admin can post updates.' });
    }

    const newUpdate = new CampaignUpdate({
      campaignId,
      title,
      content,
      creatorEmail: req.user.email,
      creatorName: campaign.creatorName || req.user.email.split('@')[0]
    });

    await newUpdate.save();
    res.status(201).json(newUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a campaign update (Protected: creator of campaign or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const update = await CampaignUpdate.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ message: 'Update not found.' });
    }

    if (update.creatorEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this update.' });
    }

    await CampaignUpdate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Update deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
