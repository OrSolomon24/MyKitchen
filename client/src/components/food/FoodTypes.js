import React, { useState } from 'react';
import AddCategory from './AddCategory';
import '../../style/FoodTypes.css';

const apiUrl = process.env.REACT_APP_API_URL;

const FoodTypes = ({ categories, onCategoryClick, selectedCategory, refreshCategories }) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const handleDeleteCategory = async (categoryId) => {
    console.log('Deleting category with ID:', categoryId); // Debugging
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${apiUrl}/api/food/category/${categoryId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Error deleting category');
      refreshCategories(); // Refresh the categories after deletion
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Error deleting category.');
    }
  };
  
  

  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev); // Toggle delete mode on and off
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
                  handleDeleteCategory(category.id); // Delete category if in delete mode
                } else {
                  onCategoryClick(category.id, category.name); // Otherwise, select category
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
      <button onClick={toggleDeleteMode} className={`delete-category-button ${isDeleteMode ? 'active' : ''}`}>
        {isDeleteMode ? 'בטל מחיקה' : 'מחק קטגוריה'}
      </button>
    </div>
  );
};

export default FoodTypes;
