require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const insuranceRoutes = require('./routes/insurance.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gigshield';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully! 🚀'))
  .catch(err => console.log('MongoDB connection error:', err.message));

app.use('/api/auth', authRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/admin', adminRoutes);

const { startAutoTrigger } = require('./utils/autoTriggerTask');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startAutoTrigger(); // BOOT THE ZERO-TOUCH BACKGROUND ORACLE
});
