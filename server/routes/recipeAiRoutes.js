// routes/recipeAiRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');
const { fetchDishById } = require('../lib/dishRepo');
const { allCategoriesOwnedBy } = require('../lib/categoryRepo');

const AGENT_URL = process.env.RECIPE_AGENT_URL || 'http://localhost:8000';

function normalizeLines(items) {
  if (!items) return [];
  const arr = Array.isArray(items) ? items : [items];

  return arr
    .flatMap((item) => String(item).split('\n'))
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

/**
 * POST /api/recipes/ai-import
 * Body: { url, name, description, categoryIds: [uuid, ...] }
 */
router.post('/ai-import', authMiddleware, async (req, res) => {
  try {
    const { url, name, description, categoryIds } = req.body;

    if (!url || !name || !description || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'url, name, description, and categoryIds are required' });
    }
    if (!(await allCategoriesOwnedBy(categoryIds, req.user.id))) {
      return res.status(400).json({ message: 'One or more categories do not exist' });
    }

    // 1. Call the Python/FastAPI + Gemini recipe-extraction service
    let agentResponse;
    try {
      agentResponse = await fetch(`${AGENT_URL}/parse-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, name, description }),
      });
    } catch (err) {
      console.error('Error calling agent service:', err);
      return res.status(500).json({ message: 'Failed to reach agent service' });
    }

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error('Agent service returned error:', errorText);
      return res
        .status(500)
        .json({ message: 'Agent service failed', detail: errorText || null });
    }

    const agentData = await agentResponse.json();
    const {
      name: finalName,
      description: finalDescription,
      ingredients,
      instructions,
    } = agentData;

    const ingredientsArray = normalizeLines(ingredients);
    const stepsArray = normalizeLines(instructions);

    // 2. Create one dish + its category links + ingredients + steps atomically
    const { data: newId, error } = await supabase.rpc('create_dish_with_relations', {
      p_name: finalName || name,
      p_description: finalDescription || description,
      p_source_url: url,
      p_category_ids: categoryIds,
      p_ingredients: ingredientsArray,
      p_steps: stepsArray,
      p_created_by: req.user.id,
    });

    if (error) {
      console.error('Error inserting AI-imported dish:', error);
      return res.status(500).json({ message: 'Failed to save imported recipe' });
    }

    const newDish = await fetchDishById(newId, req.user.id);

    return res.status(201).json({
      message: 'Recipe imported successfully with AI',
      dish: newDish,
    });
  } catch (error) {
    console.error('Error in /api/recipes/ai-import:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
