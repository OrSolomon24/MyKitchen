const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/category', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/category', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const { data, error } = await supabase.from('categories').insert({ name }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: 'An error occurred while creating the category' });
  }
});

router.delete('/category/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { count } = await supabase
      .from('dish_categories')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (count && count > 0) {
      return res.status(409).json({
        message: `Cannot delete category: ${count} recipe(s) are still assigned to it. Reassign or delete them first.`,
      });
    }

    const { error, count: deletedCount } = await supabase
      .from('categories')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (error) throw error;
    if (!deletedCount) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
