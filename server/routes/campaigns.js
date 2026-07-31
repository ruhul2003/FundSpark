const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Contribution = require('../models/Contribution');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');
const { verifyCreator, verifyAdmin } = require('../middleware/roleAuth');

// GET public approved & active campaigns with search and category filter
router.get('/', async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {
      status: 'approved',
      isSuspended: false,
      deadline: { $gte: new Date() }
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { story: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'raised') sortOptions = { amountRaised: -1 };
    if (sort === 'goal') sortOptions = { fundingGoal: -1 };
    if (sort === 'deadline') sortOptions = { deadline: 1 };

    const campaigns = await Campaign.find(query).sort(sortOptions);
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET top 6 funded campaigns for homepage
router.get('/top', async (req, res) => {
  try {
    const topCampaigns = await Campaign.find({ status: 'approved', isSuspended: false })
      .sort({ amountRaised: -1 })
      .limit(6);
    res.json(topCampaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all campaigns (Admin view)
router.get('/all', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET creator's campaigns (Creator view sorted by deadline descending)
router.get('/creator', verifyToken, verifyCreator, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creatorEmail: req.user.email }).sort({ deadline: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET pending campaigns for Admin approval
router.get('/pending', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const pendingCampaigns = await Campaign.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(pendingCampaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST Add New Campaign (Creator) -> status: pending
router.post('/', verifyToken, verifyCreator, async (req, res) => {
  try {
    const { title, story, category, fundingGoal, minContribution, deadline, rewardInfo, imageUrl } = req.body;

    if (!title || !story || !category || !fundingGoal || !deadline || !imageUrl) {
      return res.status(400).json({ message: 'Please fill in all required campaign fields' });
    }

    const campaign = new Campaign({
      title,
      story,
      category,
      fundingGoal: Number(fundingGoal),
      minContribution: Number(minContribution || 10),
      deadline: new Date(deadline),
      rewardInfo: rewardInfo || 'Thank you reward badge',
      imageUrl,
      creatorEmail: req.user.email,
      creatorName: req.user.name,
      status: 'pending'
    });

    await campaign.save();

    // Create notification for Admin
    await Notification.create({
      message: `New campaign "${title}" submitted by ${req.user.name} requires approval.`,
      toEmail: 'admin@crowdspark.com',
      actionRoute: '/dashboard/admin-approvals',
      time: new Date()
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT Update Campaign (Creator can update title, story, rewardInfo)
router.put('/:id', verifyToken, verifyCreator, async (req, res) => {
  try {
    const { title, story, rewardInfo } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    if (campaign.creatorEmail !== req.user.email && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: You can only update your own campaigns' });
    }

    if (title) campaign.title = title;
    if (story) campaign.story = story;
    if (rewardInfo) campaign.rewardInfo = rewardInfo;

    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE Campaign (Creator or Admin) -> Refunds all approved supporters!
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    if (campaign.creatorEmail !== req.user.email && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: Unauthorized action' });
    }

    // Refund approved supporters
    const approvedContributions = await Contribution.find({
      campaignId: campaign._id,
      status: 'approved'
    });

    for (const contrib of approvedContributions) {
      // Refund credits back to supporter
      await User.findOneAndUpdate(
        { email: contrib.supporterEmail },
        { $inc: { credits: contrib.amount } }
      );

      // Create refund notification for supporter
      await Notification.create({
        message: `Campaign "${campaign.title}" was deleted. Your ${contrib.amount} credits have been refunded.`,
        toEmail: contrib.supporterEmail,
        actionRoute: '/dashboard/supporter-home',
        time: new Date()
      });
    }

    // Remove contributions and campaign
    await Contribution.deleteMany({ campaignId: campaign._id });
    await Campaign.findByIdAndDelete(req.params.id);

    res.json({ message: 'Campaign deleted successfully and all supporter credits refunded.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH Approve or Reject Campaign (Admin)
router.patch('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    campaign.status = status;
    await campaign.save();

    // Create notification for creator
    await Notification.create({
      message: `Your campaign "${campaign.title}" was ${status} by Admin.`,
      toEmail: campaign.creatorEmail,
      actionRoute: '/dashboard/my-campaigns',
      time: new Date()
    });

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
