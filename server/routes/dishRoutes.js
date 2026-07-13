const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const multer = require('multer');
const supabase = require('../lib/supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');
const { fetchDishById, fetchDishListView } = require('../lib/dishRepo');
const { allCategoriesOwnedBy } = require('../lib/categoryRepo');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/dish', authMiddleware, async (req, res) => {
  try {
    const dishes = await fetchDishListView(req.user.id);
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/dish', authMiddleware, async (req, res) => {
  try {
    const { name, description, sourceUrl, categoryIds, ingredients, steps } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    if (!(await allCategoriesOwnedBy(categoryIds, req.user.id))) {
      return res.status(400).json({ message: 'One or more categories do not exist' });
    }

    const { data: newId, error } = await supabase.rpc('create_dish_with_relations', {
      p_name: name,
      p_description: description || null,
      p_source_url: sourceUrl || null,
      p_category_ids: categoryIds || [],
      p_ingredients: ingredients || [],
      p_steps: steps || [],
      p_created_by: req.user.id,
    });
    if (error) return res.status(400).json({ message: error.message });

    const newDish = await fetchDishById(newId, req.user.id);
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/dish/:id', authMiddleware, async (req, res) => {
  try {
    const dish = await fetchDishById(req.params.id, req.user.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json(dish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/dish/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // fetchDishById is owner-scoped, so this doubles as the ownership check
    // before the RPC (which trusts its caller) rewrites the dish.
    const current = await fetchDishById(id, req.user.id);
    if (!current) return res.status(404).json({ message: 'Dish not found' });
    if (req.body.categoryIds && !(await allCategoriesOwnedBy(req.body.categoryIds, req.user.id))) {
      return res.status(400).json({ message: 'One or more categories do not exist' });
    }

    const { error } = await supabase.rpc('update_dish_relations', {
      p_dish_id: id,
      p_name: req.body.name ?? current.name,
      p_description: req.body.description ?? current.description,
      p_source_url: req.body.sourceUrl ?? current.sourceUrl,
      p_category_ids: req.body.categoryIds ?? current.categoryIds,
      p_ingredients: req.body.ingredients ?? current.ingredients,
      p_steps: req.body.steps ?? current.steps,
    });
    if (error) return res.status(400).json({ message: error.message });

    const updatedDish = await fetchDishById(id, req.user.id);
    res.json(updatedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/dish/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Confirm ownership before touching storage — otherwise a user could
    // wipe another user's image files even if the row delete failed.
    const { data: dish } = await supabase
      .from('dishes')
      .select('id')
      .eq('id', id)
      .eq('created_by', req.user.id)
      .single();
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    const { data: images } = await supabase.from('dish_images').select('storage_path').eq('dish_id', id);
    if (images && images.length > 0) {
      await supabase.storage.from('dish-images').remove(images.map((img) => img.storage_path));
    }

    const { error, count } = await supabase
      .from('dishes')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('created_by', req.user.id);
    if (error) return res.status(400).json({ message: error.message });
    if (!count) return res.status(404).json({ message: 'Dish not found' });

    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/food/dish/:id/images
router.post('/dish/:id/images', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const { data: dish } = await supabase
      .from('dishes')
      .select('id')
      .eq('id', id)
      .eq('created_by', req.user.id)
      .single();
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    const ext = (req.file.mimetype.split('/')[1] || 'jpg').split(';')[0];
    const storagePath = `recipes/${id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('dish-images')
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype });
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return res.status(500).json({ message: 'Failed to upload image' });
    }

    const { count } = await supabase
      .from('dish_images')
      .select('*', { count: 'exact', head: true })
      .eq('dish_id', id);

    const { error: insertError } = await supabase
      .from('dish_images')
      .insert({ dish_id: id, storage_path: storagePath, position: count || 0 });
    if (insertError) {
      console.error('Error saving image record:', insertError);
      return res.status(500).json({ message: 'Failed to save image record' });
    }

    const updatedDish = await fetchDishById(id, req.user.id);
    return res.status(201).json(updatedDish);
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Failed to upload image' });
  }
});

// DELETE /api/food/dish/:id/images/:imageId
router.delete('/dish/:id/images/:imageId', authMiddleware, async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const { data: dish } = await supabase
      .from('dishes')
      .select('id')
      .eq('id', id)
      .eq('created_by', req.user.id)
      .single();
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    const { data: img } = await supabase
      .from('dish_images')
      .select('storage_path')
      .eq('id', imageId)
      .eq('dish_id', id)
      .single();
    if (!img) return res.status(404).json({ message: 'Image not found' });

    await supabase.storage.from('dish-images').remove([img.storage_path]);
    await supabase.from('dish_images').delete().eq('id', imageId);

    const updatedDish = await fetchDishById(id, req.user.id);
    return res.json(updatedDish);
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ message: 'Failed to delete image' });
  }
});

module.exports = router;
