// utils/recipeUtils.js

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/food/category`);
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...recipeData,
            categoryid: parseInt(categoryId, 10),
            dishid: Math.floor(Math.random() * 1000) + 1, // Random dish ID
          }),
        });
      })
    );
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};
