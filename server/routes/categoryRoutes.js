const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Route to get food categories and dishes
router.get('/category', async (req, res) => {
  try {
    console.log('Fetching categories...');
    const foodCategories = await Category.find();
    console.log('Categories:', foodCategories);
    res.json(foodCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: error.message });
  }
});


router.post('/category', async (req, res) => {
  const category = new Category(req.body);
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: 'An error occurred while creating the category' });
  }
});

module.exports = router;
