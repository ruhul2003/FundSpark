const mongoose = require('mongoose');

const campaignUpdateSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    creatorEmail: {
      type: String,
      required: true
    },
    creatorName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CampaignUpdate', campaignUpdateSchema);
