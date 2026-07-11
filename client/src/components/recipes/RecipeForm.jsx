// components/recipes/RecipeForm.js
import React from 'react';

export const RecipeForm = ({ dish, handleChange }) => {
  return (
    <div className="recipe-form">
      {/* Conditionally render the name, URL, and description fields if a URL is present */}
      {dish.sourceUrl ? (
        <>
          <label htmlFor="name">שם המתכון</label>
          <input
            id="name"
            type="text"
            value={dish.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="dish-name"
          />

          <label htmlFor="sourceUrl">URL</label>
          <input
            id="sourceUrl"
            type="text"
            value={dish.sourceUrl}
            onChange={(e) => handleChange('sourceUrl', e.target.value)}
            className="dish-url"
          />

          <label htmlFor="description">תיאור</label>
          <textarea
            id="description"
            value={dish.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </>
      ) : (
        <>
          <label htmlFor="name">שם המתכון</label>
          <input
            id="name"
            type="text"
            value={dish.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="dish-name"
          />

          <label htmlFor="description">תיאור</label>
          <textarea
            id="description"
            value={dish.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <label htmlFor="ingredients">מרכיבים</label>
          <textarea
            id="ingredients"
            value={dish.ingredients?.join('\n') || ''}
            onChange={(e) => handleChange('ingredients', e.target.value)}
          />

          <label htmlFor="steps">הוראות הכנה</label>
          <textarea
            id="steps"
            value={dish.steps?.join('\n') || ''}
            onChange={(e) => handleChange('steps', e.target.value)}
          />
        </>
      )}
    </div>
  );
};
