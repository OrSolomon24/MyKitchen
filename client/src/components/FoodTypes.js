// FoodTypes.js
import React, { useState, useEffect } from 'react';
import '../style/FoodTypes.css';

const FoodTypes = ({ categories, onCategoryClick, selectedCategory, refreshCategories }) => {
  const [currentCategories, setCurrentCategories] = useState(categories);

  useEffect(() => {
    setCurrentCategories(categories);
  }, [categories]);

  const getNewCategoryId = () => {
    if (currentCategories.length === 0) return 1;
    const maxId = Math.max(...currentCategories.map(cat => cat.id));
    return maxId + 1;
  };

  const onAddCategoryClick = async () => {
    const newCategoryName = prompt('הכנס שם קטגוריה חדשה');
    if (newCategoryName) {
      const newCategoryId = getNewCategoryId();
      try {
        const response = await fetch('http://localhost:5000/api/food/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: newCategoryId, name: newCategoryName }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const newCategory = await response.json();
        // Optionally, call refreshCategories to reload categories from the server
        refreshCategories();
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category. Please try again.');
      }
    }
  };

  return (
    <div className="category-list">
      <h1>סוגי אוכל</h1>
      <ul>
        {currentCategories.length > 0 ? (
          currentCategories.map((category) => (
            <li 
              key={category.id} 
              onClick={() => onCategoryClick(category.id, category.name)} 
              className={selectedCategory === category.id ? 'selected' : ''}
            >
              {category.name}
            </li>
          ))
        ) : (
          <p>Loading categories...</p>
        )}
      </ul>
      <button className="add-category-button" onClick={onAddCategoryClick}>הוסף קטגוריה</button>
      </div>
  );
};

export default FoodTypes;
