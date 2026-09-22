const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');
const Campaign = require('../models/Campaign');
const { verifyToken } = require('../middleware/auth');

// GET all milestones for a specific campaign (Public)
router.get('/campaign/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const milestones = await Milestone.find({ campaignId }).sort({ targetAmount: 1, order: 1 });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a milestone for a campaign (Protected: creator of campaign or admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { campaignId, title, description, targetAmount, order } = req.body;

    if (!campaignId || !title || !description || targetAmount === undefined) {
      return res.status(400).json({ message: 'Campaign ID, title, description, and targetAmount are required.' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // Check if user is campaign creator or admin
    if (campaign.creatorEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the campaign creator or an admin can add milestones.' });
    }

    const newMilestone = new Milestone({
      campaignId,
      title: title.trim(),
      description: description.trim(),
      targetAmount: Number(targetAmount),
      order: order ? Number(order) : 0,
      creatorEmail: req.user.email,
      status: Number(campaign.amountRaised || 0) >= Number(targetAmount) ? 'completed' : 'pending',
      completedAt: Number(campaign.amountRaised || 0) >= Number(targetAmount) ? new Date() : null
    });

    await newMilestone.save();
    res.status(201).json(newMilestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update a milestone (Protected: creator of campaign or admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, targetAmount, status, order } = req.body;
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    const campaign = await Campaign.findById(milestone.campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Associated campaign not found.' });
    }

    if (milestone.creatorEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this milestone.' });
    }

    if (title) milestone.title = title.trim();
    if (description) milestone.description = description.trim();
    if (targetAmount !== undefined) milestone.targetAmount = Number(targetAmount);
    if (order !== undefined) milestone.order = Number(order);

    if (status) {
      milestone.status = status;
      if (status === 'completed' && !milestone.completedAt) {
        milestone.completedAt = new Date();
      } else if (status !== 'completed') {
        milestone.completedAt = null;
      }
    }

    await milestone.save();
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a milestone (Protected: creator of campaign or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    if (milestone.creatorEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this milestone.' });
    }

    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Milestone deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
