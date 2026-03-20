const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  platform: { type: String, required: true },
  riskScore: { type: Number, default: 0 },
  activePlan: { 
    type: String, 
    enum: ['None', 'Basic', 'Pro', 'Elite'],
    default: 'None'
  },
  coverage: { type: Number, default: 0 },
  coverageRemaining: { type: Number, default: 0 },
  premium: { type: Number, default: 0 },
  maxClaimsPerWeek: { type: Number, default: 0 },
  claimsThisWeek: { type: Number, default: 0 },
  totalPayouts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
