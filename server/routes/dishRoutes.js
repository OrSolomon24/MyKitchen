// server/routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// Get all dishes
router.get('/dish', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Add a new dish
router.post('/dish', async (req, res) => {
  const dish = new Dish(req.body);
  try {
    const newDish = await dish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
