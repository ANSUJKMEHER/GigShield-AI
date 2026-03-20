const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Claim = require('../models/Claim');
const { detectFraud } = require('../utils/fraudDetection');
const { calculateRisk } = require('../utils/riskLogic');

const plans = {
  Basic: { premium: 10, coverage: 300, maxClaims: 1 },
  Pro: { premium: 25, coverage: 800, maxClaims: 2 },
  Elite: { premium: 40, coverage: 1500, maxClaims: 3 }
};

router.get('/risk/:city', (req, res) => {
  res.json(calculateRisk(req.params.city));
});

router.post('/subscribe', async (req, res) => {
  try {
    const { userId, plan } = req.body;
    const user = await User.findById(userId);
    if (!user || !plans[plan]) return res.status(400).json({ message: 'Invalid request' });
    
    user.activePlan = plan;
    user.premium = plans[plan].premium;
    user.coverage = plans[plan].coverage;
    user.coverageRemaining = plans[plan].coverage;
    user.maxClaimsPerWeek = plans[plan].maxClaims;
    user.claimsThisWeek = 0;
    
    await user.save();
    res.json({ message: 'Subscribed successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/simulate-event', async (req, res) => {
  try {
    const { userId, triggerEvent, city, expectedIncome, actualIncome, isWorkerActive, isGpsVerified, isTelemetryValid = true } = req.body;
    
    const user = await User.findById(userId);
    if (!user || user.activePlan === 'None') return res.status(400).json({ message: 'No active insurance plan' });

    if (user.claimsThisWeek >= user.maxClaimsPerWeek) {
      return res.status(400).json({ message: `Weekly limit of ${user.maxClaimsPerWeek} claims reached.` });
    }
    if (user.coverageRemaining <= 0) {
      return res.status(400).json({ message: 'Weekly coverage limit exhausted.' });
    }

    const loss = expectedIncome - actualIncome;
    if (loss < 100) { 
      return res.status(400).json({ message: `Loss of ₹${loss} is below the minimum ₹100 threshold.` });
    }

    const fraudCheck = await detectFraud(userId, triggerEvent, city, isWorkerActive, isGpsVerified, isTelemetryValid);
    const eventDetails = {
      severity: triggerEvent === 'Heavy Rain' ? '92mm Rainfall' : triggerEvent === 'High AQI' ? 'AQI 420' : triggerEvent === 'Curfew' ? 'Zone Locked Over 4km' : 'Server Down 45mins',
      deliveryDrop: Math.floor(Math.random() * (65 - 35) + 35) + '%'
    };

    if (fraudCheck.isFraud) {
      const rejectedClaim = new Claim({ 
        userId, triggerEvent, city, expectedIncome, actualIncome, loss, payoutAmount: 0, status: 'Rejected',
        fraudChecks: fraudCheck.checks,
        eventDetails,
        rejectionReason: fraudCheck.reason
      });
      await rejectedClaim.save();
      return res.status(400).json({ message: fraudCheck.reason, claim: rejectedClaim });
    }

    const payoutAmount = Math.min(loss, user.coverageRemaining);

    const claim = new Claim({
      userId, triggerEvent, city, expectedIncome, actualIncome, loss, payoutAmount, status: 'Approved',
      fraudChecks: fraudCheck.checks,
      eventDetails,
      rejectionReason: ""
    });
    await claim.save();

    user.totalPayouts += payoutAmount;
    user.coverageRemaining -= payoutAmount;
    user.claimsThisWeek += 1;
    await user.save();

    res.json({ message: `₹${payoutAmount} credited instantly!`, payoutAmount, coverageRemaining: user.coverageRemaining, claim });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
});

module.exports = router;
