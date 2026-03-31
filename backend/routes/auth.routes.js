const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Claim = require('../models/Claim');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { calculateRisk } = require('../utils/riskLogic');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_demo';

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, city, platform, zone = 'General', lat, lon, workingHoursStart, workingHoursEnd } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const riskData = await calculateRisk(city, zone, lat, lon, 0); // Adding pastClaimsCount=0
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name, email, password: hashedPassword, city, platform, zone,
      riskScore: riskData.riskScore,
      location: (lat && lon) ? { lat, lon } : null,
      workingHours: (workingHoursStart && workingHoursEnd) ? { start: workingHoursStart, end: workingHoursEnd } : null,
    });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User created successfully', user, token, premiumSuggestion: riskData.premiumSuggestion });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Fallback securely for older plain-text users from early demo tests
    const isMatch = user.password.startsWith('$2a$') 
      ? await bcrypt.compare(password, user.password) 
      : user.password === password;

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const claims = await Claim.find({ userId: user._id }).sort({ createdAt: -1 });
    // return user via lean() or just attach claims to response object
    res.json({ user, claims });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const { name, city, platform, zone, workingHoursStart, workingHoursEnd } = req.body;
    let user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Check if risk score recalculation is needed
    let newRiskScore = user.riskScore;
    if (city !== user.city || zone !== user.zone) {
       const riskData = await calculateRisk(city || user.city, zone || user.zone, user.location?.lat, user.location?.lon, user.pastClaimsCount);
       newRiskScore = riskData.riskScore;
    }

    user.name = name || user.name;
    user.city = city || user.city;
    user.platform = platform || user.platform;
    user.zone = zone || user.zone;
    user.riskScore = newRiskScore;
    if (workingHoursStart && workingHoursEnd) {
       user.workingHours = { start: workingHoursStart, end: workingHoursEnd };
    }
    
    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;
