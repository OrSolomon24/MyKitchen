// components/foodCategories/FoodTypes.js
import React, { useState } from 'react';
import AddCategory from './AddCategory';
import DeleteCategory from './DeleteCategory';
import { deleteCategory } from '../../utils/foodCategoriesUtils';

import '../../style/FoodTypes.css';

const FoodTypes = ({ categories, onCategoryClick, selectedCategory, refreshCategories }) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    try {
      await deleteCategory(categoryId);
      setIsDeleteMode(false);
      refreshCategories();
    } catch (error) {
      alert('Error deleting category.');
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
  };

  return (
    <div className="category-list">
      <h1>סוגי אוכל</h1>
      <ul>
        {categories.length ? (
          categories.map((category) => (
            <li
              key={category.id}
              onClick={() => {
                if (isDeleteMode) {
                  handleDeleteCategory(category.id);
                } else {
                  onCategoryClick(category.id, category.name);
                }
              }}
              className={selectedCategory === category.id ? 'selected' : ''}
            >
              {category.name}
            </li>
          ))
        ) : (
          <p>טוען קטגוריות...</p>
        )}
      </ul>
      <AddCategory refreshCategories={refreshCategories} />
      <DeleteCategory
        isDeleteMode={isDeleteMode}
        toggleDeleteMode={toggleDeleteMode}
      />
    </div>
  );
};

export default FoodTypes;