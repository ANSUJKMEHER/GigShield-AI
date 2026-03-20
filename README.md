# 🛡️ GigShield AI: AI-Powered Parametric Insurance for India’s Gig Economy

**A Guidewire DEVTrails 2026 Submission** | **Phase 1: Ideation & Foundation**

GigShield AI is a parametric insurance platform designed exclusively for platform-based Delivery Partners to protect their livelihoods from uncontrollable external disruptions that cause immediate loss of daily wages.

---

## 1. 🎯 Persona & Workflow Scenarios

**Our Persona:** Food & Q-Commerce Delivery Partners (e.g., Zomato, Swiggy, Zepto/Blinkit).

**The Scenario:** 
A Zomato partner in Mumbai expects to make ₹500 on a Friday evening. A sudden 90mm torrential downpour halts the city. The partner loses ₹300 of their expected earnings. Currently, they bear this loss entirely, with zero health or vehicle coverage offering them income relief. 

**The Workflow:** 
GigShield continuously monitors local weather triggers. When the disruption occurs, it instantly calculates the expected ₹500 vs the actual ₹200 earned, and automatically pays out the ₹300 difference to their wallet—no claims adjusters, no paperwork, no waiting.

---

## 2. 📅 The Weekly Premium Model & Parametric Triggers

Gig workers operate and are paid week-to-week. Thus, our financial model strictly avoids heavy annual premiums in favor of micro-deductions.
- **Weekly Pricing Model:** Basic (₹10/wk covering ₹300), Pro (₹25/wk covering ₹800), and Elite (₹40/wk covering ₹1500 limit).

### Core Triggers Insuring "Loss of Income" Only:
1. **Environmental:** Heavy Rain / Floods / High AQI (Hazardous air where riding is impossible).
2. **Social & Systemic:** Unplanned localized curfews or sudden App/Server Crashes (e.g., Platform goes down for 3 hours on a weekend).

### Web vs. Mobile Platform Justification
We built GigShield as a **Mobile-First Progressive Web Application (PWA)**. 
*Why?* Gig workers shouldn't need perfectly high-end phones with vast storage to download another heavy native app just to manage insurance policies. A lightweight, globally accessible web dashboard ensures zero friction and maximum accessibility, even on low-bandwidth networks.

---

## 3. 🧠 AI/ML Integration Strategy

Our AI engine governs two critical nodes of the insurance lifecycle:
1. **Dynamic Risk Assessment & Premium Calculation:** Our ML model assesses historical geographical data (e.g., frequency of monsoons in Mumbai vs gridlock in Bangalore) and assigns a dynamic 0.0 - 1.0 **Risk Score** to the worker's zone, automatically adjusting the suggested weekly plan to protect the liquidity pool.
2. **Intelligent Fraud Detection:** (Detailed below in *Adversarial Defense*). It cross-references environmental triggers with device telemetry to prevent syndicate-level fraud.

---

## 4. 🧰 Tech Stack & Development Plan

**Stack:**
- **Frontend:** React (Vite, Tailwind CSS, Lucide Icons) for a glassmorphism, native-feeling UI.
- **Backend:** Node.js + Express.js APIs.
- **Database:** MongoDB Atlas (Cloud) storing Users and immutable Claim Logs.

**6-Week Development Plan:**
- **Phase 1 (Weeks 1-2):** Ideation, Persona Research, Architecture Foundation, and UI Prototypes (Current Stage).
- **Phase 2 (Weeks 3-4):** Integration of external Oracle APIs (Weather/Traffic Maps) and real AI model deployments.
- **Phase 3 (Weeks 5-6):** Hardening smart contracts, security testing, and final hackathon presentation polish.

---

## 5. 🛑 Adversarial Defense & Anti-Spoofing Strategy (CRISIS UPDATE)

In response to the zero-day threat of syndicate-level GPS spoofing (e.g., organized rings triggering false weather payouts from home), our architecture deprecates single-point GPS reliance in favor of **Multi-Layered Telemetry & Contextual AI**.

### The Differentiation: AI Contextual Matching
Standard systems only read coordinates. Our AI model distinguishes between a genuine gig worker trapped in a storm and a spoofer on a couch by analyzing **environmental and biomechanical context**. A spoofer can fake `lat/long`, but they cannot easily fake the micro-vibrations of a running vehicle or the network latency profile of a congested cell tower in a red-alert weather zone.

### The Data: Beyond GPS Coordinates
To detect coordinated fraud rings, our deep-validation pipeline analyzes:
- **Biomechanical Telemetry:** Gyroscope and accelerometer data. A worker stranded in a storm exhibits erratic micro-movements; a spoofer's phone resting on a table is perfectly static.
- **Network ISP & BSSID Fingerprinting:** If 50 "stranded" workers map to the exact same residential Wi-Fi BSSID, they are flagged as a syndicate node.
- **Battery & Thermal Degradation:** Active navigation in severe weather alters device thermals significantly compared to a plugged-in phone at home.

### The UX Fair-Play Balance: Soft Quarantine
Honest workers dropping offline due to bad weather are buffered by a 30-minute grace period. If a claim is flagged by the anti-spoofing AI (e.g., GPS says outside, but telemetry says resting on a desk), the payout is paused, and the worker is prompted for a micro-task (e.g., 3-second live video of the vehicle dashboard) to release funds.

---

## 6. 🎬 2-Minute Demo Flow

1. **Land on Auth**: Go to `http://localhost:5173`. Show the premium UI.
2. **Signup (Demonstrate AI Mock)**: 
   - Fill in details. Select **City: Mumbai**.
   - Note that Risk Logic flags Mumbai as High Risk automatically.
3. **Dashboard & Subscription**: 
   - The user's Dashboard shows City Risk Level.
   - Click **Select Plan** (e.g., Pro at ₹25/wk).
4. **Trigger Parametric Event**: 
   - Under "Simulate Parametric Trigger", click **Heavy Rain**. 
   - *Observe*: The AI Evaluation system evaluates the trigger and mocks a ₹500 vs ₹200 income drop.
   - The claim is auto-approved and the UI slides in a "₹300 Credited" verified popup!
5. **Intelligent Fraud Detection Showcase**:
   - In the "Fraud Modifiers" panel, toggle off **AI Telemetry**.
   - Click "Heavy Rain" again. Notice the **Claim Rejected & Syndicate Block Enabled** error, proving the multi-layered anti-spoofing logic works live!
6. **Admin Portal**: 
   - Navigate to the **Admin Area** (from Navbar or `/admin` route). 
   - Show the aggregated metrics (Users, Claims, Fraud Blocked, Total Payout).
