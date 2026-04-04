# 🎬 GigShield 2-Minute Demo Script (Phase 2 Submission)

**Important Setup Before You Record:**
- **Screen Layout:** Place the Admin Panel on the right side of your screen (`/admin` login), and the Worker Mobile Dashboard on the left side of your screen. 
- Ensure you have **deleted** any old accounts you had and are creating a brand new one live on camera so you can show the registration flow perfectly.

---

### [0:00 - 0:25] Registration & The Neural Network (Dynamic Pricing)
*(Start recording on the "Create Account" screen of the Worker App)*

**Action:** Type in your Name, "Mumbai" as the City, choose "Zomato", and select **"Flood Prone (Dharavi)"** as the Threat Zone. Click "Create Account".

**Speaker:** 
"Welcome to GigShield AI, the first parametric insurance system for gig workers. We tackle the 'Protect Your Worker' theme by eliminating paperwork. 
When a worker registers, they define their operating city and specific risk zone. Under the hood, we are immediately running a Machine Learning Neural Network using `brain.js`. The model evaluates the local Threat Zone against real-time weather inputs from the Open-Meteo API to generate an initial algorithmic risk score."

---

### [0:25 - 0:55] Insurance Policy Management
*(Worker is redirected to Dashboard. Click "Get Covered" or navigate to the Plans Tab.)*

**Action:** Click the button to select the **Elite Plan**. 

**Speaker:** 
"Gig workers need flexibility. Here, the worker can manage their own policies. Notice how the premiums are dynamically calculated. If the ML engine spots a high historical risk of waterlogging combined with a dense crime zone, the premium optimally adjusts. Our worker chooses the 'Elite Plan'—giving them instant coverage against spontaneous urban disruptions. To prevent fraud, the backend locks coverage to a strict daily boundary constraint."

---

### [0:55 - 1:30] Mock API Triggers & Algorithmic Evaluation 
*(Focus entirely on the right side of the screen - The Admin Panel)*

**Action:** On the Admin panel, point (with your mouse) to the "Parametric Webhooks" section. Leave the Target City blank (it defaults to Mumbai). Click the **"Heavy Rain"** button explicitly.

**Speaker:** 
"Instead of forcing workers to file manual reports when a disaster strikes, we built 3-5 automated trigger oracles. When our Mock API fires a 'Severe Weather' alert for Mumbai, the backend springs into action. 
It queries the database, skips anyone who exceeded their weekly limit, and automatically processes the math for expected income loss versus the actual API severity metric—all without human input."

---

### [1:30 - 2:00] The Magic Zero-Touch Claims UI
*(Wait 3-4 seconds without clicking anything on the Worker app. In fact, pull your hands away from the mouse! Let the magical green 'Zero-Touch Check Passed' popup slide into the worker's dashboard on its own!)*

**Action:** Hands off the keyboard. Let the beautiful green notification popup appear on the worker's page. Go to the Home tab to show their total earnings dynamically increased to ₹300.

**Speaker:** 
"And here is the magic of the Zero-Touch User Experience. Look at the worker's screen.
Through background polling, the worker's phone instantly receives a push notification confirming the automated claim. The payout is credited directly to their balance. Beautiful, paperless, and frictionless. GigShield ensures that the moment our workers lose their income, they instantly reclaim their dignity."

*(Stop Recording)*
