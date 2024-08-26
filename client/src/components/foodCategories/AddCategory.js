// components/foodCategories/AddCategory.js
import React from 'react';
import { addCategory } from '../../utils/foodCategoriesUtils';
import '../../style/AddCategory.css';

const AddCategory = ({ refreshCategories }) => {
  const handleAddCategory = async () => {
    const newCategoryName = prompt('הכנס שם קטגוריה חדשה');
    if (!newCategoryName) return;

    try {
      const newCategoryId = Math.floor(Math.random() * 1000) + 1;

      await addCategory(newCategoryId, newCategoryName);
      refreshCategories();
    } catch (error) {
      alert('Error adding category.');
    }
  };

  return <button onClick={handleAddCategory} className="add-category-button">הוסף קטגוריה</button>;
};

export default AddCategory;
