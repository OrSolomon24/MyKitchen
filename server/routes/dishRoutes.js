const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const { getCache, setCache, clearCache } = require('../utils/cache');
const authMiddleware = require('../middleware/authMiddleware');

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

router.get('/dish',authMiddleware, async (req, res) => {
  const cached = getCache('dishes');
  if (cached) return res.json(cached);

  try {
    const dishes = await Dish.find();
    setCache('dishes', dishes, ONE_WEEK);
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/dish',authMiddleware, async (req, res) => {
  try {
    const dish = new Dish(req.body);
    const newDish = await dish.save();
    clearCache('dishes');
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/dish/:id',authMiddleware, async (req, res) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDish) return res.status(404).json({ message: 'Dish not found' });

    clearCache('dishes');
    res.json(updatedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/dish/:id',authMiddleware, async (req, res) => {
  try {
    const deletedDish = await Dish.findByIdAndDelete(req.params.id);
    if (!deletedDish) return res.status(404).json({ message: 'Dish not found' });

    clearCache('dishes');
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
