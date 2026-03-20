exports.calculateRisk = (city) => {
  const cityLower = city.toLowerCase();
  if (['mumbai', 'delhi'].includes(cityLower)) {
    return { riskScore: 0.8, premiumSuggestion: 'High (₹40/week)' };
  } else if (['bangalore', 'pune', 'chennai', 'hyderabad'].includes(cityLower)) {
    return { riskScore: 0.5, premiumSuggestion: 'Medium (₹25/week)' };
  } else {
    return { riskScore: 0.2, premiumSuggestion: 'Low (₹10/week)' };
  }
};
