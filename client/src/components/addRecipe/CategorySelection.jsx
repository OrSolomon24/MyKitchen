// components/addRecipe/CategorySelection.js
import React from 'react';

export const CategorySelection = ({ categories, handleCategoryChange, selectedCategories }) => (
  <fieldset className="category-selection">
    <legend>בחר קטגוריות:</legend>
    {categories.length > 0 ? (
      <div className="category-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <input
              type="checkbox"
              id={`category-${category.id}`}
              value={category.id.toString()}
              onChange={handleCategoryChange}
              checked={selectedCategories.includes(category.id.toString())}
            />
            <label htmlFor={`category-${category.id}`}>{category.name}</label>
          </div>
        ))}
      </div>
    ) : (
      <p>טוען קטגוריות...</p>
    )}
  </fieldset>
);
