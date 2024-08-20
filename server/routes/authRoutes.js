// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Replace this with your actual user data retrieval (e.g., from a database)
const users = [{ username: 'amit', password: '123' }];

router.post('/', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

module.exports = router;
