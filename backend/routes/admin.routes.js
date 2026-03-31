const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Claim = require('../models/Claim');

router.get('/stats', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const claims = await Claim.find().sort({ createdAt: -1 });

    const totalUsers = users.length;
    const claimsCount = claims.length;
    
    let totalPayout = 0;
    claims.forEach(c => totalPayout += c.payoutAmount);
    
    const fraudAttempts = claims.filter(c => c.status === 'Rejected').length;
    const activePolicies = users.filter(u => u.activePlan !== 'None').length;
    
    res.json({
      totalUsers,
      claimsCount,
      fraudAttempts,
      totalPayout,
      activePolicies,
      users,
      claims
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-weekly', async (req, res) => {
  try {
    const users = await User.find({ activePlan: { $ne: 'None' } });
    let resetCount = 0;
    for (const u of users) {
      u.claimsThisWeek = 0;
      u.coverageRemaining = u.coverage;
      await u.save();
      resetCount++;
    }
    res.json({ message: `Weekly limits reset for ${resetCount} active policies.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error resetting weeks' });
  }
});

module.exports = router;
