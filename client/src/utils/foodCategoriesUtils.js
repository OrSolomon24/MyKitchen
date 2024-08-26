// utils/foodCategoriesUtils.js

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

export const fetchDishes = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/food/dish`);
    if (!response.ok) throw new Error('Error fetching dishes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dishes:', error);
    throw error;
  }
};

export const refreshCategories = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/food/category`);
    if (!response.ok) throw new Error('Error refreshing categories');
    return await response.json();
  } catch (error) {
    console.error('Error refreshing categories:', error);
    throw error;
  }
};

export const addCategory = async (newCategoryId, newCategoryName) => {
    try {
      const response = await fetch(`${apiUrl}/api/food/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newCategoryId, name: newCategoryName }),
      });
  
      if (!response.ok) throw new Error('Error adding category');
      return response.json();
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  export const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${apiUrl}/api/food/category/${categoryId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Error deleting category');
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };
