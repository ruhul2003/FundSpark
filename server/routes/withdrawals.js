const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');
const { verifyCreator, verifyAdmin } = require('../middleware/roleAuth');

// POST Submit Withdrawal Request (Creator)
router.post('/', verifyToken, verifyCreator, async (req, res) => {
  try {
    const { withdrawalCredit, paymentSystem, accountNumber } = req.body;
    const creditsToWithdraw = Number(withdrawalCredit);

    if (!creditsToWithdraw || creditsToWithdraw < 200) {
      return res.status(400).json({ message: 'Minimum withdrawal requirement is 200 credits ($10).' });
    }

    if (!paymentSystem || !accountNumber) {
      return res.status(400).json({ message: 'Payment system and account number are required.' });
    }

    const creator = await User.findById(req.user.id);
    if (!creator || creator.raisedCredits < creditsToWithdraw) {
      return res.status(400).json({ message: 'Insufficient raised credits available.' });
    }

    // 20 credits = 1 Dollar
    const dollarAmount = creditsToWithdraw / 20;

    const withdrawal = new Withdrawal({
      creatorEmail: creator.email,
      creatorName: creator.name,
      withdrawalCredit: creditsToWithdraw,
      withdrawalAmount: dollarAmount,
      paymentSystem,
      accountNumber,
      status: 'pending',
      withdrawDate: new Date()
    });

    await withdrawal.save();

    // Create notification for Admin
    await Notification.create({
      message: `Withdrawal request of $${dollarAmount} (${creditsToWithdraw} credits) submitted by ${creator.name}.`,
      toEmail: 'admin@crowdspark.com',
      actionRoute: '/dashboard/admin-withdrawals',
      time: new Date()
    });

    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Creator's withdrawal requests & history
router.get('/creator', verifyToken, verifyCreator, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ creatorEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Admin's list of pending withdrawal requests
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const pendingWithdrawals = await Withdrawal.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(pendingWithdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH Mark Withdrawal Success (Admin)
router.patch('/:id/success', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal request not found' });

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal request is no longer pending' });
    }

    const creator = await User.findOne({ email: withdrawal.creatorEmail });
    if (!creator || creator.raisedCredits < withdrawal.withdrawalCredit) {
      return res.status(400).json({ message: 'Creator does not have sufficient raised credits left' });
    }

    // Approve withdrawal and deduct raised credits
    withdrawal.status = 'approved';
    await withdrawal.save();

    creator.raisedCredits -= withdrawal.withdrawalCredit;
    await creator.save();

    // Notification for Creator (Admin approved withdrawal)
    await Notification.create({
      message: `Your withdrawal request of $${withdrawal.withdrawalAmount} (${withdrawal.withdrawalCredit} credits) was approved and processed successfully by Admin.`,
      toEmail: withdrawal.creatorEmail,
      actionRoute: '/dashboard/withdrawals',
      time: new Date()
    });

    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
