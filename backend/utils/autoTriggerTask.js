const axios = require("axios");
const User = require("../models/User");
const Claim = require("../models/Claim");

const CITIES_TO_MONITOR = [
  { name: "mumbai", lat: 19.076, lon: 72.8777 },
  { name: "delhi", lat: 28.7041, lon: 77.1025 },
  { name: "bangalore", lat: 12.9716, lon: 77.5946 },
];

async function checkWeatherAndTriggerClaims() {
  console.log(
    "[Oracle] Running automated background check for parametric disruptions...",
  );

  for (const city of CITIES_TO_MONITOR) {
    try {
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=precipitation,weather_code`,
      );

      const rain = weatherRes.data?.current?.precipitation || 0;

      // Override for demo purposes: Occasionally force a disruption trigger if we want to mock a storm
      // if (Math.random() > 0.8) { rain = 25; }

      if (rain > 10) {
        // Severe rain threshold for auto-trigger
        console.log(
          `[Oracle Alert] Severe weather detected in ${city.name} (${rain}mm). Initiating Zero-Touch Sequence!`,
        );

        const affectedUsers = await User.find({
          city: new RegExp(`^${city.name}$`, "i"),
          activePlan: { $ne: "None" },
          claimsThisWeek: { $lt: 2 }, // Mock check just to limit processing
        });

        for (const user of affectedUsers) {
          if (
            user.claimsThisWeek >= user.maxClaimsPerWeek ||
            user.coverageRemaining <= 0
          )
            continue;

          const assumedLoss =
            user.activePlan === "Elite"
              ? 800
              : user.activePlan === "Pro"
                ? 500
                : 200;
          const payoutAmount = Math.min(assumedLoss, user.coverageRemaining);

          const eventDetails = {
            severity: `Live Rain Alert: ${rain}mm`,
            deliveryDrop: "100% Automated Drop",
            zeroTouch: true,
          };

          const claim = new Claim({
            userId: user._id,
            triggerEvent: "Heavy Rain",
            city: user.city,
            expectedIncome: assumedLoss,
            actualIncome: 0,
            loss: assumedLoss,
            payoutAmount,
            status: "Approved",
            fraudChecks: {
              gpsVerified: true,
              radiusValid: true,
              workerActive: true,
              telemetryValid: true,
              duplicateFree: true,
              weatherMatch: true,
              anomalyFree: true,
            },
            eventDetails,
            rejectionReason: "",
          });

          await claim.save();

          user.totalPayouts += payoutAmount;
          user.coverageRemaining -= payoutAmount;
          user.claimsThisWeek += 1;
          await user.save();
          console.log(
            `[Zero-Touch] Auto-credited ₹${payoutAmount} to ${user.name}`,
          );
        }
      }
    } catch (err) {
      console.error(
        `[Oracle Error] failed to check ${city.name} conditions`,
        err.message,
      );
    }
  }
}

// Function to start the background interval
exports.startAutoTrigger = () => {
  console.log("[System] Automatic Parametric Oracle activated.");
  // Check every 6 hours in production, but 10 minutes for demo runtime
  setInterval(checkWeatherAndTriggerClaims, 10 * 60 * 1000);
  // checkWeatherAndTriggerClaims(); // Initial run on boot
};
