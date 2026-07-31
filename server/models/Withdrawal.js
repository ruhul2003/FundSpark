const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema(
  {
    creatorEmail: { type: String, required: true },
    creatorName: { type: String, required: true },
    withdrawalCredit: { type: Number, required: true },
    withdrawalAmount: { type: Number, required: true }, // Dollar value (20 credits = 1 dollar)
    paymentSystem: { type: String, required: true }, // Stripe, Bkash, Nagad, Rocket, Bank
    accountNumber: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    withdrawDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
