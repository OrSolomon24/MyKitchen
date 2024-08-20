// AddCategory.js
import React from 'react';
import '../../style/AddCategory.css';

const apiUrl = process.env.REACT_APP_API_URL;

const AddCategory = ({ refreshCategories }) => {
  const handleAddCategory = async () => {
    const newCategoryName = prompt('הכנס שם קטגוריה חדשה');
    if (!newCategoryName) return;

    try {
      // Generate a random ID (you can also base it on the existing categories)
      const newCategoryId = Math.floor(Math.random() * 1000) + 1;

      const response = await fetch(`${apiUrl}/api/food/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newCategoryId, name: newCategoryName }),
      });

      if (!response.ok) throw new Error('Error adding category');
      refreshCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Error adding category.');
    }
  };

  return <button onClick={handleAddCategory} className="add-category-button">הוסף קטגוריה</button>;
};

export default AddCategory;
