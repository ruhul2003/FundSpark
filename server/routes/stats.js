const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Contribution = require('../models/Contribution');
const Payment = require('../models/Payment');
const { verifyToken } = require('../middleware/auth');

// Supporter Dashboard Stats
router.get('/supporter', verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const totalCount = await Contribution.countDocuments({ supporterEmail: email });
    const pendingCount = await Contribution.countDocuments({ supporterEmail: email, status: 'pending' });

    const approvedContribs = await Contribution.find({ supporterEmail: email, status: 'approved' });
    const totalContributedAmount = approvedContribs.reduce((sum, c) => sum + c.amount, 0);

    res.json({
      totalCount,
      pendingCount,
      totalContributedAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Creator Dashboard Stats
router.get('/creator', verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const totalCampaigns = await Campaign.countDocuments({ creatorEmail: email });
    const activeCampaigns = await Campaign.countDocuments({
      creatorEmail: email,
      deadline: { $gte: new Date() }
    });

    const campaigns = await Campaign.find({ creatorEmail: email });
    const totalAmountRaised = campaigns.reduce((sum, c) => sum + (c.amountRaised || 0), 0);

    res.json({
      totalCampaigns,
      activeCampaigns,
      totalAmountRaised
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Dashboard Stats
router.get('/admin', verifyToken, async (req, res) => {
  try {
    const totalSupporters = await User.countDocuments({ role: 'Supporter' });
    const totalCreators = await User.countDocuments({ role: 'Creator' });

    const allUsers = await User.find();
    const totalAvailableCredits = allUsers.reduce((sum, u) => sum + (u.credits || 0), 0);

    const allPayments = await Payment.find();
    const totalPaymentsProcessed = allPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

    res.json({
      totalSupporters,
      totalCreators,
      totalAvailableCredits,
      totalPaymentsProcessed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Community Leaderboard & Hall of Fame (Public)
router.get('/leaderboard', async (req, res) => {
  try {
    // 1. Top Backers by Approved Contribution Amount
    const topBackersAgg = await Contribution.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$supporterEmail',
          supporterName: { $first: '$supporterName' },
          totalContributed: { $sum: '$amount' },
          campaignsSupported: { $addToSet: '$campaignId' },
          contributionsCount: { $sum: 1 },
          lastContributionDate: { $max: '$createdAt' }
        }
      },
      { $sort: { totalContributed: -1 } },
      { $limit: 15 }
    ]);

    const topBackers = topBackersAgg.map((b, idx) => {
      let badge = 'Pioneer Backer';
      if (idx === 0) badge = 'Grand Patron';
      else if (idx === 1) badge = 'Diamond Supporter';
      else if (idx === 2) badge = 'Platinum Backer';
      else if (idx < 5) badge = 'Gold Champion';

      // Mask email for privacy (e.g., johndoe@gmail.com -> j***e@gmail.com)
      const emailParts = (b._id || '').split('@');
      let maskedEmail = 'supporter';
      if (emailParts.length === 2) {
        const username = emailParts[0];
        const maskedUser = username.length > 2
          ? `${username[0]}***${username[username.length - 1]}`
          : `${username[0]}***`;
        maskedEmail = `${maskedUser}@${emailParts[1]}`;
      }

      return {
        rank: idx + 1,
        supporterName: b.supporterName || 'Anonymous Supporter',
        maskedEmail,
        totalContributed: b.totalContributed,
        campaignsCount: b.campaignsSupported ? b.campaignsSupported.length : 1,
        contributionsCount: b.contributionsCount,
        badge,
        lastActive: b.lastContributionDate
      };
    });

    // 2. Top Funded Campaigns
    const topCampaigns = await Campaign.find({
      status: 'approved',
      isSuspended: false
    })
      .sort({ amountRaised: -1 })
      .limit(10)
      .select('title story category fundingGoal amountRaised minContribution deadline imageUrl creatorName');

    const formattedCampaigns = topCampaigns.map((c, idx) => ({
      rank: idx + 1,
      _id: c._id,
      title: c.title,
      category: c.category,
      imageUrl: c.imageUrl,
      creatorName: c.creatorName,
      amountRaised: c.amountRaised || 0,
      fundingGoal: c.fundingGoal,
      percentFunded: Math.min(100, Math.round(((c.amountRaised || 0) / c.fundingGoal) * 100)),
      deadline: c.deadline
    }));

    // 3. Top Creators by Total Raised Funds
    const topCreatorsAgg = await Campaign.aggregate([
      { $match: { status: 'approved', isSuspended: false } },
      {
        $group: {
          _id: '$creatorEmail',
          creatorName: { $first: '$creatorName' },
          totalRaised: { $sum: '$amountRaised' },
          campaignsCount: { $sum: 1 }
        }
      },
      { $sort: { totalRaised: -1 } },
      { $limit: 10 }
    ]);

    const topCreators = topCreatorsAgg.map((c, idx) => ({
      rank: idx + 1,
      creatorName: c.creatorName || 'Visionary Creator',
      totalRaised: c.totalRaised,
      campaignsCount: c.campaignsCount
    }));

    // 4. Platform Overview Stats
    const totalCampaigns = await Campaign.countDocuments({ status: 'approved', isSuspended: false });
    const totalMembers = await User.countDocuments();
    const totalContributionsCount = await Contribution.countDocuments({ status: 'approved' });
    const totalRaisedAgg = await Campaign.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amountRaised' } } }
    ]);
    const totalCreditsMobilized = totalRaisedAgg[0]?.total || 0;

    res.json({
      topBackers,
      topCampaigns: formattedCampaigns,
      topCreators,
      overview: {
        totalCampaigns,
        totalMembers,
        totalContributionsCount,
        totalCreditsMobilized
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
