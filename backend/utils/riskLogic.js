const axios = require("axios");
const { predictDynamicPremium } = require("./mlEngine");

exports.calculateRisk = async (
  city,
  zone = "General",
  lat = null,
  lon = null,
  pastClaimsCount = 0,
) => {
  let rain = 0;

  // 1. Live Weather / AQI Impact (Live Telemetry)
  if (lat && lon) {
    try {
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=precipitation,weather_code`,
      );
      if (weatherRes.data && weatherRes.data.current) {
        rain = weatherRes.data.current.precipitation || 0;
      }
    } catch (e) {
      console.log("Error fetching weather in risk logic", e.message);
    }
  }

  // 2. Delegate to Machine Learning Neural Network Engine
  // The Neural Network dynamically computes the final weekly premium in Rupees
  // based on the non-linear relationship between Zone Danger, Live Weather, and Past Claims.
  const aiPredictedPremium = predictDynamicPremium(zone, rain, pastClaimsCount);

  // Derive a basic Risk Score from the output correlation for UI display (0.1 to 1.0)
  // E.g., if AI predicts ₹40, that's high risk (~0.8). If ₹8, that's low risk (~0.1).
  const baseRiskScore = Math.min(1.0, Math.max(0.1, aiPredictedPremium / 50));

  const premiumSuggestion =
    baseRiskScore >= 0.8 ? "High" : baseRiskScore >= 0.5 ? "Medium" : "Low";

  return {
    riskScore: Number(baseRiskScore.toFixed(2)),
    premiumSuggestion: `${premiumSuggestion} (₹${aiPredictedPremium}/week)`,
    basePremium: aiPredictedPremium,
  };
};
