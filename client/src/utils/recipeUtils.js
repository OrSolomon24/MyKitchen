// utils/recipeUtils.js

import { getAuthHeader } from './authHeader';
const apiUrl = process.env.REACT_APP_API_URL;

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/food/category`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    if (!response.ok) throw new Error('Error fetching categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addRecipe = async (recipeData, selectedCategories) => {
  try {
    await Promise.all(
      selectedCategories.map(async (categoryId) => {
        await fetch(`${apiUrl}/api/food/dish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            ...recipeData,
            categoryid: parseInt(categoryId, 10),
            dishid: Math.floor(Math.random() * 1000) + 1,
          }),
        });
      })
    );
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};


export const importRecipeFromLinkWithAI = async ({
  url,
  name,
  description,
  categoryIds,
}) => {
  try {
    const response = await fetch(`${apiUrl}/api/recipes/ai-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(), // same auth as other endpoints
      },
      body: JSON.stringify({
        url,
        name,
        description,
        // convert category IDs from string → number (like addRecipe does)
        categoryIds: categoryIds.map((id) => parseInt(id, 10)),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to import recipe from link with AI');
    }

    return await response.json();
  } catch (error) {
    console.error('Error importing recipe with AI:', error);
    throw error;
  }
};
