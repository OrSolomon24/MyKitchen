// 📁 routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { getCache, setCache } = require('../utils/cache');

const TWO_WEEKS_IN_MS = 1000 * 60 * 60 * 24 * 14;

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const cachedToken = getCache(`token-${username}`);
    if (cachedToken) {
      return res.status(200).json({ token: cachedToken });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '14d', // Important: actual token should also expire in 2 weeks
    });

    setCache(`token-${username}`, token, TWO_WEEKS_IN_MS);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
