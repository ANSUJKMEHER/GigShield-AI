const axios = require('axios');

exports.calculateRisk = async (city, zone = 'General', lat = null, lon = null, pastClaimsCount = 0) => {
  const cityLower = city.toLowerCase();
  const zoneLower = zone.toLowerCase();
  
  let baseRiskScore = 0.2;
  let basePremium = 10;
  let premiumSuggestion = 'Low';

  if (['mumbai', 'delhi'].includes(cityLower)) {
    baseRiskScore = 0.5;
    basePremium = 25;
  } else if (['bangalore', 'pune', 'chennai', 'hyderabad'].includes(cityLower)) {
    baseRiskScore = 0.4;
    basePremium = 20;
  }

  // Hyper-local mapping adjustments
  if (zoneLower.includes('safe') || zoneLower.includes('high ground') || zoneLower.includes('drought')) {
    basePremium = Math.max(5, basePremium - 2); 
    baseRiskScore = Math.max(0.1, baseRiskScore - 0.1);
  } else if (zoneLower.includes('flood') || zoneLower.includes('water logging') || zoneLower.includes('slum')) {
    basePremium += 5; 
    baseRiskScore = Math.min(1.0, baseRiskScore + 0.15);
  }

  // 1. Live Weather / AQI Impact (Zero-Touch Sensor Integration)
  if (lat && lon) {
    try {
      const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=precipitation,weather_code`);
      if (weatherRes.data && weatherRes.data.current) {
        const rain = weatherRes.data.current.precipitation || 0;
        if (rain > 5) { // Severe weather dynamically increases current risk map
            basePremium += 15;
            baseRiskScore = Math.min(1.0, baseRiskScore + 0.35);
        } else if (rain > 0) {
            basePremium += 5;
            baseRiskScore = Math.min(1.0, baseRiskScore + 0.15);
        }
      }
    } catch (e) {
      console.log('Error fetching weather in risk logic', e.message);
    }
  }

  // 2. Dynamic Premium Scaling (Past Claims)
  if (pastClaimsCount && pastClaimsCount > 0) {
      basePremium += (pastClaimsCount * 5); // Add ₹5 per frequency count
      baseRiskScore = Math.min(1.0, baseRiskScore + (pastClaimsCount * 0.05));
  }

  premiumSuggestion = baseRiskScore >= 0.8 ? 'High' : baseRiskScore >= 0.5 ? 'Medium' : 'Low';

  return { 
    riskScore: Number(baseRiskScore.toFixed(2)), 
    premiumSuggestion: `${premiumSuggestion} (₹${basePremium}/week)`,
    basePremium
  };
};
