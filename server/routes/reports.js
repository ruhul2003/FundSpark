const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Campaign = require('../models/Campaign');
const { verifyToken } = require('../middleware/auth');
const { verifyAdmin, verifySupporter } = require('../middleware/roleAuth');

// POST Report a Campaign (Supporter or logged in user)
router.post('/', verifyToken, verifySupporter, async (req, res) => {
  try {
    const { campaignId, reason } = req.body;
    if (!campaignId || !reason) {
      return res.status(400).json({ message: 'Campaign ID and report reason are required' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const report = new Report({
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      reporterEmail: req.user.email,
      reporterName: req.user.name,
      reason
    });

    await report.save();
    res.status(201).json({ message: 'Report submitted successfully. Admin will review your report.', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET All Reports (Admin)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH Suspend or Action Campaign Report (Admin)
router.patch('/:id/suspend', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const campaign = await Campaign.findById(report.campaignId);
    if (campaign) {
      campaign.isSuspended = true;
      await campaign.save();
    }

    report.status = 'resolved';
    await report.save();

    res.json({ message: 'Campaign suspended and report resolved', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
