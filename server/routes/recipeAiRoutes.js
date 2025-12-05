// routes/recipeAiRoutes.js
const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const authMiddleware = require('../middleware/authMiddleware');
const { clearCache } = require('../utils/cache');

const fetch = global.fetch || require('node-fetch');

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
 * Body: { url, name, description, categoryIds: [1, 2, ...] }
 */
router.post('/ai-import', authMiddleware, async (req, res) => {
  try {
    const { url, name, description, categoryIds } = req.body;

    if (!url || !name || !description || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'url, name, description, and categoryIds are required' });
    }

    // 1. Call the Python LangGraph + Gemini service
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

    // 🔹 normalize to array-of-lines
    const ingredientsArray = normalizeLines(ingredients);
    const instructionsArray = normalizeLines(instructions);

    // if you want instruction stored as ONE string with line breaks (like manual flow):
    const instructionText = instructionsArray.join('\n');

    // 2. Insert into Mongo
    // (you no longer need dishid if you moved to _id everywhere)
    const docsToInsert = categoryIds.map((categoryId) => ({
      categoryid: parseInt(categoryId, 10),
      name: finalName || name,
      description: finalDescription || description,
      ingredients: ingredientsArray,    // 👈 now REAL array
      instruction: instructionText,     // 👈 string (as before)
    }));

    const newDishes = await Dish.insertMany(docsToInsert);

    // 3. Clear dishes cache
    clearCache('dishes');

    return res.status(201).json({
      message: 'Recipe imported successfully with AI',
      dishes: newDishes,
    });
  } catch (error) {
    console.error('Error in /api/recipes/ai-import:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
