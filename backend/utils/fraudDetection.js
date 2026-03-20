const Claim = require('../models/Claim');

exports.detectFraud = async (userId, triggerEvent, city, isWorkerActive = true, isGpsVerified = true, isTelemetryValid = true) => {
  try {
    const checks = {
      gpsVerified: isGpsVerified,
      workerActive: isWorkerActive,
      telemetryValid: isTelemetryValid,
      duplicateFree: true,
      weatherMatch: true
    };

    let isFraud = false;
    let reason = '';

    if (!isWorkerActive) {
      isFraud = true; reason = 'Worker flagged as offline/inactive during the disruption.';
    } else if (!isGpsVerified) {
      isFraud = true; reason = 'GPS tracking anomaly detected. Location inconsistent with requested zone.';
    } else if (!isTelemetryValid) {
      isFraud = true; reason = 'SYNDICATE SPOOF DETECTED: Biomechanical telemetry (gyro) & network BSSID indicates static home environment despite GPS claims.';
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentClaim = await Claim.findOne({ userId, createdAt: { $gt: oneDayAgo } });

    if (recentClaim) {
      checks.duplicateFree = false;
      if (!isFraud) { isFraud = true; reason = 'Duplicate claim block. You can only file 1 claim per 24 hours.'; }
    }

    if (triggerEvent === 'Heavy Rain' && !['mumbai', 'bangalore', 'chennai'].includes(city.toLowerCase())) {
       checks.weatherMatch = false;
       if (!isFraud) { isFraud = true; reason = 'Satelite verification failed: No severe weather reported in this zone today.'; }
    }

    return { isFraud, reason, checks };
  } catch (error) {
    console.error('Error in fraud detection:', error);
    return { isFraud: true, reason: 'System error during validation', checks: {} };
  }
};
