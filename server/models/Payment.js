const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    packageName: { type: String, required: true },
    creditsPurchased: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    paymentIntentId: { type: String, required: true },
    paymentMethod: { type: String, default: 'Stripe' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
