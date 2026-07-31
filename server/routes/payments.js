const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_secret_key');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { verifySupporter } = require('../middleware/roleAuth');

// Credit Packages configuration
const CREDIT_PACKAGES = {
  100: { price: 10, name: '100 credits package' },
  300: { price: 25, name: '300 credits package' },
  800: { price: 60, name: '800 credits package' },
  1500: { price: 110, name: '1500 credits package' }
};

// Create Stripe Payment Intent
router.post('/create-intent', verifyToken, verifySupporter, async (req, res) => {
  try {
    const { credits } = req.body;
    const pkg = CREDIT_PACKAGES[credits];

    if (!pkg) {
      return res.status(400).json({ message: 'Invalid credit package selected' });
    }

    let clientSecret = 'mock_client_secret_' + Date.now();

    try {
      if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('Mock')) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: pkg.price * 100, // cents
          currency: 'usd',
          metadata: {
            userEmail: req.user.email,
            credits: credits.toString()
          }
        });
        clientSecret = paymentIntent.client_secret;
      }
    } catch (stripeErr) {
      console.warn('Stripe intent fallback to test client secret:', stripeErr.message);
    }

    res.json({
      clientSecret,
      packageName: pkg.name,
      credits: Number(credits),
      amount: pkg.price
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm Credit Purchase & Credit Balance Update
router.post('/confirm', verifyToken, verifySupporter, async (req, res) => {
  try {
    const { creditsPurchased, amountPaid, packageName, paymentIntentId } = req.body;

    const credits = Number(creditsPurchased);
    const amount = Number(amountPaid);

    if (!credits || !amount) {
      return res.status(400).json({ message: 'Invalid payment confirmation data' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Add credits to Supporter account
    user.credits += credits;
    await user.save();

    // Create Payment Record
    const payment = new Payment({
      userEmail: user.email,
      userName: user.name,
      packageName: packageName || `${credits} credits package`,
      creditsPurchased: credits,
      amountPaid: amount,
      paymentIntentId: paymentIntentId || `pi_simulated_${Date.now()}`
    });

    await payment.save();

    res.json({
      message: `Successfully purchased ${credits} credits!`,
      newBalance: user.credits,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET User Payment History
router.get('/history', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
