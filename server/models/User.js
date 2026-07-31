const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    photoURL: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' },
    role: { type: String, enum: ['Supporter', 'Creator', 'Admin'], default: 'Supporter' },
    credits: { type: Number, default: 0 },
    raisedCredits: { type: Number, default: 0 } // For Creator role
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
