const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Claim = require('../models/Claim');
const { calculateRisk } = require('../utils/riskLogic');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, city, platform } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const riskData = calculateRisk(city);
    user = new User({
      name, email, password, city, platform,
      riskScore: riskData.riskScore,
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user, premiumSuggestion: riskData.premiumSuggestion });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', user });
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

module.exports = router;
