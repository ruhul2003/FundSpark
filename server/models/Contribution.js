const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    campaignTitle: { type: String, required: true },
    amount: { type: Number, required: true },
    supporterEmail: { type: String, required: true },
    supporterName: { type: String, required: true },
    creatorEmail: { type: String, required: true },
    creatorName: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    message: { type: String, default: 'Super excited to support this amazing project!' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contribution', contributionSchema);
