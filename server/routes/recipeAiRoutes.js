// routes/recipeAiRoutes.js
const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const authMiddleware = require('../middleware/authMiddleware');
const { clearCache } = require('../utils/cache');

// If you're on Node 18+, you can use global fetch and remove this require.
// Otherwise, install: npm install node-fetch
const fetch = global.fetch || require('node-fetch');

const AGENT_URL = process.env.RECIPE_AGENT_URL || 'http://localhost:8000';

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

    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [];
    const instructionsArray = Array.isArray(instructions) ? instructions : [];

    const ingredientsText = ingredientsArray.join('\n');
    const instructionText = instructionsArray.join('\n');

    // 2. Insert into Mongo – same idea as your /dish POST
    const dishid = Math.floor(Math.random() * 1000) + 1;

    const docsToInsert = categoryIds.map((categoryId) => ({
      categoryid: parseInt(categoryId, 10),
      dishid,
      name: finalName || name,
      description: finalDescription || description,
      ingredients: ingredientsText,
      instruction: instructionText,
    }));

    const newDishes = await Dish.insertMany(docsToInsert);

    // 3. Clear dishes cache, like in /dish POST
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
