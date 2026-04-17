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

router.get('/risk/:city', async (req, res) => {
  const { zone, lat, lon, pastClaimsCount } = req.query;
  try {
    const riskData = await calculateRisk(
      req.params.city, 
      zone, 
      lat ? Number(lat) : null, 
      lon ? Number(lon) : null, 
      pastClaimsCount ? Number(pastClaimsCount) : 0
    );
    res.json(riskData);
  } catch(e) {
    res.status(500).json({message: 'Failed to calculate risk'});
  }
});

router.post('/subscribe', async (req, res) => {
  try {
    const { userId, plan } = req.body;
    const user = await User.findById(userId);
    if (!user || !plans[plan]) return res.status(400).json({ message: 'Invalid request' });
    
    // Dynamic Premium Calculation with new async AI risk engine
    const lat = user.location ? user.location.lat : null;
    const lon = user.location ? user.location.lon : null;
    const pastClaimsCount = user.pastClaimsCount || 0;
    
    const riskData = await calculateRisk(user.city, user.zone, lat, lon, pastClaimsCount);
    const multiplier = plan === 'Pro' ? 2 : plan === 'Elite' ? 3 : 1;
    const finalPremium = riskData.basePremium * multiplier;

    user.activePlan = plan;
    user.premium = finalPremium;
    user.coverage = plans[plan].coverage;
    user.coverageRemaining = plans[plan].coverage;
    user.maxClaimsPerWeek = plans[plan].maxClaims;
    user.claimsThisWeek = 0;
    
    // Core Rules Inject: For Hackathon demo, set instantly active (1 min in the past)
    user.policyActiveAt = new Date(Date.now() - 60 * 1000);
    
    await user.save();
    res.json({ message: 'Subscribed successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/cancel', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.activePlan = 'None';
    user.premium = 0;
    user.coverage = 0;
    user.coverageRemaining = 0;
    user.maxClaimsPerWeek = 0;
    user.claimsThisWeek = 0;
    
    await user.save();
    res.json({ message: 'Policy cancelled successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error cancelling policy' });
  }
});

router.post('/simulate-event', async (req, res) => {
  try {
    const { userId, triggerEvent, city, expectedIncome, actualIncome, liveGps, liveWeather, telemetryVariance, isWorkerActive = true } = req.body;
    
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

    const fraudCheck = await detectFraud(userId, triggerEvent, city, liveGps, liveWeather, telemetryVariance, isWorkerActive, expectedIncome, actualIncome);
    const eventDetails = {
      severity: triggerEvent === 'Heavy Rain' ? `Live Rain: ${liveWeather?.rain || 0}mm` : triggerEvent === 'High AQI' ? 'AQI 420' : triggerEvent === 'Curfew' ? 'Zone Locked Over 4km' : 'Server Down 45mins',
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

    if (fraudCheck.requiresReview) {
      const reviewClaim = new Claim({ 
        userId, triggerEvent, city, expectedIncome, actualIncome, loss, payoutAmount: 0, status: 'Under Review',
        fraudChecks: fraudCheck.checks,
        eventDetails,
        rejectionReason: fraudCheck.reason
      });
      await reviewClaim.save();
      return res.status(200).json({ 
         message: 'Claim soft-flagged for Admin Manual Review. Payout paused.', 
         claim: reviewClaim,
         requiresReview: true
      });
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

// ZERO-TOUCH CLAIM WEBHOOK
// This acts as a mock public API trigger (e.g. weather API says "Heavy Rain in Zone X")
// It finds all workers in that zone and auto-creates a claim.
router.post('/webhook/trigger-disruption', async (req, res) => {
  try {
    const { city, zone, triggerEvent, eventSeverity } = req.body;
    
    // Find all users in affected city/zone with an active plan
    const affectedUsers = await User.find({ 
      city, 
      ...(zone ? { zone } : {}), 
      activePlan: { $ne: 'None' } 
    });

    let claimsCreated = 0;
    let totalPayout = 0;

    for (const user of affectedUsers) {
      if (user.claimsThisWeek >= user.maxClaimsPerWeek || user.coverageRemaining <= 0) continue;

      // Mock loss calculation based on plan/severity
      const assumedLoss = user.activePlan === 'Elite' ? 800 : user.activePlan === 'Pro' ? 500 : 200;
      const payoutAmount = Math.min(assumedLoss, user.coverageRemaining);

      const eventDetails = {
        severity: eventSeverity || 'Severe Disruption',
        deliveryDrop: '100% Automated Drop',
        zeroTouch: true
      };

      const claim = new Claim({
        userId: user._id,
        triggerEvent,
        city: user.city,
        expectedIncome: assumedLoss,
        actualIncome: 0,
        loss: assumedLoss,
        payoutAmount,
        status: 'Approved',
        fraudChecks: {
          gpsVerified: true, workerActive: true, telemetryValid: true, duplicateFree: true, weatherMatch: true
        },
        eventDetails,
        rejectionReason: ""
      });

      await claim.save();

      user.totalPayouts += payoutAmount;
      user.coverageRemaining -= payoutAmount;
      user.claimsThisWeek += 1;
      await user.save();

      claimsCreated++;
      totalPayout += payoutAmount;
    }

    res.json({ 
      message: `Disruption triggered successfully. Processing zero-touch claims.`,
      stats: { usersAffected: affectedUsers.length, claimsCreated, totalPayout }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error triggering disruption' });
  }
});

module.exports = router;
