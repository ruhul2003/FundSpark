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

module.exports = router;
