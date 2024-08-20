const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Dish = require('../models/Dish'); // Import the Dish model

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

// server/routes/categoryRoutes.js
router.delete('/category/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);

    // First, delete the category
    const deletedCategory = await Category.findOneAndDelete({ id: categoryId });
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Then, delete all dishes associated with the deleted category
    await Dish.deleteMany({ categoryid: categoryId });

    res.json({ message: 'Category and associated dishes deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





module.exports = router;
