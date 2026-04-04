const brain = require('brain.js');

// 1. Initialize a true Feed-Forward Neural Network
// This uses CPU fallback since we ignored native bindings for Windows compatibility
const net = new brain.NeuralNetwork({
  hiddenLayers: [4, 4], // 2 hidden layers with 4 neurons each
  activation: 'sigmoid' // standard non-linear activation
});

// 2. Generate Synthetic Historical Training Data
// We map scenarios the gig worker faces. 
// Inputs:
// - zoneDanger: 0.1 (Safe), 0.5 (General), 0.9 (Flood/Crime)
// - weatherSeverity: 0.1 (Clear), 0.5 (Rain), 0.9 (Severe Storm/AQI)
// - pastClaimsFreq: 0.1 (0 claims), 0.5 (2 claims), 0.9 (5+ claims)
// Outputs: 
// - premiumScale: 0.1 (Lowest Price ~₹8) to 0.9 (Highest Price ~₹45)

const trainingData = [
  // Extremely Safe Profiles
  { input: { zoneDanger: 0.1, weatherSeverity: 0.1, pastClaimsFreq: 0.1 }, output: { premiumScale: 0.10 } },
  { input: { zoneDanger: 0.1, weatherSeverity: 0.2, pastClaimsFreq: 0.1 }, output: { premiumScale: 0.12 } },
  
  // Moderate Risk Profiles (Typical User)
  { input: { zoneDanger: 0.5, weatherSeverity: 0.1, pastClaimsFreq: 0.1 }, output: { premiumScale: 0.20 } },
  { input: { zoneDanger: 0.5, weatherSeverity: 0.5, pastClaimsFreq: 0.1 }, output: { premiumScale: 0.35 } },
  { input: { zoneDanger: 0.1, weatherSeverity: 0.1, pastClaimsFreq: 0.5 }, output: { premiumScale: 0.30 } },

  // High Risk Profiles (Flood Prone)
  { input: { zoneDanger: 0.9, weatherSeverity: 0.1, pastClaimsFreq: 0.1 }, output: { premiumScale: 0.40 } },
  { input: { zoneDanger: 0.9, weatherSeverity: 0.5, pastClaimsFreq: 0.1 }, output: { premiumScale: 0.60 } },
  
  // Catastrophic / High Liability Profiles (Bad zone + Bad weather + High Claims)
  { input: { zoneDanger: 0.9, weatherSeverity: 0.9, pastClaimsFreq: 0.1 }, output: { premiumScale: 0.85 } },
  { input: { zoneDanger: 0.9, weatherSeverity: 0.9, pastClaimsFreq: 0.9 }, output: { premiumScale: 0.95 } },
  { input: { zoneDanger: 0.5, weatherSeverity: 0.9, pastClaimsFreq: 0.5 }, output: { premiumScale: 0.70 } }
];

console.log('🤖 [ML Framework] Booting AI Risk Engine...');

// 3. Train the model dynamically on boot
net.train(trainingData, {
  iterations: 20000, 
  errorThresh: 0.005,
  log: false, 
  learningRate: 0.1
});

console.log('🧠 [ML Framework] Neural Network Training Complete!');

/**
 * Predict Dynamic Premium utilizing the trained Neural Network
 * @param {string} zone 
 * @param {number} rain_mm 
 * @param {number} pastClaims 
 * @returns {number} Predicted Premium in Rupees
 */
exports.predictDynamicPremium = (zone, rain_mm = 0, pastClaims = 0) => {
  // Normalize Inputs
  const zoneLower = (zone || '').toLowerCase();
  let zoneDanger = 0.5; // Default General
  if (zoneLower.includes('safe') || zoneLower.includes('high ground')) zoneDanger = 0.1;
  if (zoneLower.includes('flood') || zoneLower.includes('crime') || zoneLower.includes('slum')) zoneDanger = 0.9;

  let weatherSeverity = Math.min(0.9, (rain_mm / 20) + 0.1); 
  let pastClaimsFreq = Math.min(0.9, (pastClaims / 5) + 0.1);

  // 🏃‍♂️ RUN THE NEURAL NETWORK FORWARD PROPAGATION
  const aiPrediction = net.run({ zoneDanger, weatherSeverity, pastClaimsFreq });
  
  // Denormalize the output (Scale 0.1 - 1.0 to ₹5 - ₹50)
  // Let's say 0.1 -> ₹8, 0.9 -> ₹45. Formula: output * 50
  
  let finalPremium = Math.round(aiPrediction.premiumScale * 50);
  
  // Safety floor
  if (finalPremium < 5) finalPremium = 5;

  return finalPremium;
};
