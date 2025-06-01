const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Dish = require('../models/Dish');
const { getCache, setCache, clearCache } = require('../utils/cache');
const authMiddleware = require('../middleware/authMiddleware');
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

router.get('/category',authMiddleware, async (req, res) => {
  const cached = getCache('categories');
  if (cached) return res.json(cached);

  try {
    const foodCategories = await Category.find();
    setCache('categories', foodCategories, ONE_WEEK);
    res.json(foodCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/category',authMiddleware, async (req, res) => {
  try {
    const category = new Category(req.body);
    const newCategory = await category.save();
    clearCache('categories');
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: 'An error occurred while creating the category' });
  }
});

router.delete('/category/:id',authMiddleware, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    const deletedCategory = await Category.findOneAndDelete({ id: categoryId });
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });

    await Dish.deleteMany({ categoryid: categoryId });
    clearCache('categories');
    clearCache('dishes');
    res.json({ message: 'Category and associated dishes deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
