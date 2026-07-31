const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');
const { verifyCreator, verifySupporter } = require('../middleware/roleAuth');

// POST Submit Contribution (Supporter)
router.post('/', verifyToken, verifySupporter, async (req, res) => {
  try {
    const { campaignId, amount, message } = req.body;
    const contributionAmount = Number(amount);

    if (!campaignId || !contributionAmount || contributionAmount <= 0) {
      return res.status(400).json({ message: 'Valid campaign ID and contribution amount are required' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    if (campaign.status !== 'approved' || campaign.isSuspended) {
      return res.status(400).json({ message: 'Campaign is not accepting contributions' });
    }

    const supporter = await User.findById(req.user.id);
    if (!supporter || supporter.credits < contributionAmount) {
      return res.status(400).json({ message: 'Insufficient credits available in your account' });
    }

    // Deduct credits from Supporter provisionally for the pending contribution
    supporter.credits -= contributionAmount;
    await supporter.save();

    const contribution = new Contribution({
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      amount: contributionAmount,
      supporterEmail: supporter.email,
      supporterName: supporter.name,
      creatorEmail: campaign.creatorEmail,
      creatorName: campaign.creatorName,
      status: 'pending',
      message: message || 'Supporting this project!'
    });

    await contribution.save();

    // Create notification for Creator
    await Notification.create({
      message: `${supporter.name} contributed ${contributionAmount} credits to "${campaign.title}"`,
      toEmail: campaign.creatorEmail,
      actionRoute: '/dashboard/creator-home',
      time: new Date()
    });

    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Pending Contributions to Review (Creator)
router.get('/creator', verifyToken, verifyCreator, async (req, res) => {
  try {
    const contributions = await Contribution.find({
      creatorEmail: req.user.email,
      status: 'pending'
    }).sort({ createdAt: -1 });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Supporter Contributions with PAGINATION
router.get('/supporter', verifyToken, verifySupporter, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query = { supporterEmail: req.user.email };

    const total = await Contribution.countDocuments(query);
    const contributions = await Contribution.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      contributions,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Approved Contributions for Supporter Home
router.get('/supporter/approved', verifyToken, verifySupporter, async (req, res) => {
  try {
    const approvedContributions = await Contribution.find({
      supporterEmail: req.user.email,
      status: 'approved'
    }).sort({ createdAt: -1 });

    res.json(approvedContributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH Approve Contribution (Creator)
router.patch('/:id/approve', verifyToken, verifyCreator, async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

    if (contribution.creatorEmail !== req.user.email && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: You can only approve contributions for your campaigns' });
    }

    if (contribution.status !== 'pending') {
      return res.status(400).json({ message: 'Contribution status is no longer pending' });
    }

    contribution.status = 'approved';
    await contribution.save();

    // Add amount to campaign raised
    const campaign = await Campaign.findById(contribution.campaignId);
    if (campaign) {
      campaign.amountRaised += contribution.amount;
      await campaign.save();
    }

    // Add amount to creator's raised credits
    await User.findOneAndUpdate(
      { email: contribution.creatorEmail },
      { $inc: { raisedCredits: contribution.amount } }
    );

    // Create Notification for Supporter (exact requirement format)
    await Notification.create({
      message: `Your Contribution of ${contribution.amount} credits to ${contribution.campaignTitle} was approved by ${contribution.creatorName}`,
      toEmail: contribution.supporterEmail,
      actionRoute: '/dashboard/supporter-home',
      time: new Date()
    });

    res.json(contribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH Reject Contribution (Creator) -> Refunds credits back to supporter!
router.patch('/:id/reject', verifyToken, verifyCreator, async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

    if (contribution.creatorEmail !== req.user.email && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: You can only reject contributions for your campaigns' });
    }

    if (contribution.status !== 'pending') {
      return res.status(400).json({ message: 'Contribution status is no longer pending' });
    }

    contribution.status = 'rejected';
    await contribution.save();

    // Refund credits to supporter's account
    await User.findOneAndUpdate(
      { email: contribution.supporterEmail },
      { $inc: { credits: contribution.amount } }
    );

    // Create Notification for Supporter
    await Notification.create({
      message: `Your Contribution of ${contribution.amount} credits to ${contribution.campaignTitle} was rejected by ${contribution.creatorName} and refunded to your balance.`,
      toEmail: contribution.supporterEmail,
      actionRoute: '/dashboard/my-contributions',
      time: new Date()
    });

    res.json(contribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
