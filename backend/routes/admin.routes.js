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
    
    let totalPremiums = 0;
    users.forEach(u => totalPremiums += (u.premium || 0));
    
    const lossRatio = totalPremiums > 0 ? ((totalPayout / totalPremiums) * 100).toFixed(2) : 0;
    
    const fraudAttempts = claims.filter(c => c.status === 'Rejected').length;
    const activePolicies = users.filter(u => u.activePlan !== 'None').length;
    
    res.json({
      totalUsers,
      claimsCount,
      fraudAttempts,
      totalPayout,
      totalPremiums,
      lossRatio,
      activePolicies,
      users,
      claims
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/predictive-analytics', async (req, res) => {
  try {
    // Phase 3: Simulated Predictive Analytics based on ML Engine & Upcoming Weather Fronts
    // In production, this would query a forward-looking API (e.g. 7-day forecast) and push through brain.js
    const mockPrediction = [
      { day: 'Mon', riskFactor: 0.2, predictedClaims: 12 },
      { day: 'Tue', riskFactor: 0.3, predictedClaims: 18 },
      { day: 'Wed', riskFactor: 0.8, predictedClaims: 85, alert: 'High Rain Forecast' }, // Anomaly prediction
      { day: 'Thu', riskFactor: 0.6, predictedClaims: 45 },
      { day: 'Fri', riskFactor: 0.2, predictedClaims: 15 },
      { day: 'Sat', riskFactor: 0.1, predictedClaims: 5 },
      { day: 'Sun', riskFactor: 0.1, predictedClaims: 3 }
    ];
    
    res.json({ forecast: mockPrediction });
  } catch(error) {
    res.status(500).json({ message: 'Error generating predictive analytics' });
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
