const Claim = require('../models/Claim');

const cityCoordinates = {
  'mumbai': { lat: 19.0760, lon: 72.8777 },
  'delhi': { lat: 28.7041, lon: 77.1025 },
  'bangalore': { lat: 12.9716, lon: 77.5946 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'chennai': { lat: 13.0827, lon: 80.2707 }
};

// Haversine formula for radius checking
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

exports.detectFraud = async (userId, triggerEvent, city, liveGps, liveWeather, telemetryVariance, isWorkerActive = true, expectedIncome = null, actualIncome = null) => {
  try {
    const isGpsVerified = liveGps && liveGps.lat != null && liveGps.lon != null;
    let isRadiusValid = true;
    
    // NEW: Location Radius Validation (within 50km of city center)
    if (isGpsVerified && city && cityCoordinates[city.toLowerCase()]) {
      const cityCoords = cityCoordinates[city.toLowerCase()];
      const distance = getDistanceFromLatLonInKm(liveGps.lat, liveGps.lon, cityCoords.lat, cityCoords.lon);
      if (distance > 50) { 
        isRadiusValid = false;
      }
    }

    const isTelemetryValid = telemetryVariance > 0.5; // Significant movement detected
    
    // Evaluate live weather match
    let isWeatherMatch = true;
    if (triggerEvent === 'Heavy Rain') {
      if (!liveWeather || (liveWeather.rain === 0 && liveWeather.weather_code < 61)) {
        isWeatherMatch = false;
      }
    }

    // NEW: Anomaly Detection (Movement vs Income mismatch)
    // If worker moving fast but logs literally 0 income -> potential spoofed ride simulation
    let isAnomalyDetected = false;
    if (isTelemetryValid && actualIncome === 0 && expectedIncome > 200) {
      isAnomalyDetected = true;
    }

    const checks = {
      gpsVerified: isGpsVerified,
      radiusValid: isRadiusValid,
      workerActive: isWorkerActive,
      telemetryValid: isTelemetryValid,
      duplicateFree: true,
      weatherMatch: isWeatherMatch,
      anomalyFree: !isAnomalyDetected
    };

    let isFraud = false;
    let reason = '';

    if (!isWorkerActive) {
      isFraud = true; reason = 'Worker flagged as offline/inactive during the disruption.';
    } else if (!isGpsVerified) {
      isFraud = true; reason = 'GPS tracking anomaly: Browser location disabled or unavailable.';
    } else if (!isRadiusValid) {
      isFraud = true; reason = 'Geospatial bounds error: GPS location is outside the authorized policy radius.';
    } else if (!isTelemetryValid) {
      isFraud = true; reason = `SYNDICATE SPOOF DETECTED: Biomechanical telemetry (Variance ${telemetryVariance.toFixed(2)}) indicates a static device.`;
    } else if (isAnomalyDetected) {
      isFraud = true; reason = 'Behavioral Anomaly: Continuous high-variance movement logged with zero revenue generation implies simulated routing.';
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentClaim = await Claim.findOne({ userId, createdAt: { $gt: oneDayAgo } });

    if (recentClaim) {
      checks.duplicateFree = false;
      if (!isFraud) { isFraud = true; reason = 'Duplicate claim block. You can only file 1 claim per 24 hours.'; }
    }

    if (triggerEvent === 'Heavy Rain' && !checks.weatherMatch) {
       if (!isFraud) { isFraud = true; reason = 'Satellite verification failed: Live Open-Meteo API reports no rain at your GPS coordinates.'; }
    }

    return { isFraud, reason, checks };
  } catch (error) {
    console.error('Error in fraud detection:', error);
    return { isFraud: true, reason: 'System error during validation', checks: {} };
  }
};
