const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  triggerEvent: { type: String, required: true }, // Heavy Rain, High AQI, Curfew
  city: { type: String, required: true },

  expectedIncome: { type: Number, required: true },
  actualIncome: { type: Number, required: true },
  loss: { type: Number, required: true },

  payoutAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Approved", "Rejected", "Under Review"],
    default: "Approved",
  },

  fraudChecks: { type: Object, default: {} },
  eventDetails: { type: Object, default: {} },
  rejectionReason: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Claim", ClaimSchema);
