const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    story: { type: String, required: true },
    category: { type: String, required: true },
    fundingGoal: { type: Number, required: true },
    amountRaised: { type: Number, default: 0 },
    minContribution: { type: Number, required: true, default: 10 },
    deadline: { type: Date, required: true },
    rewardInfo: { type: String, default: 'Special thank you badge & digital updates' },
    imageUrl: { type: String, required: true },
    creatorEmail: { type: String, required: true },
    creatorName: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isSuspended: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);
