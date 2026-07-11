// components/addRecipe/LinkRecipeForm.js
import React from 'react';

export const LinkRecipeForm = ({
  recipeLink,
  setRecipeLink,
  recipeName,
  setRecipeName,
  recipeDescription,
  setRecipeDescription,
}) => (
  <>
    <label htmlFor="recipe-link">קישור למתכון:</label>
    <input
      type="url"
      id="recipe-link"
      placeholder="הזן את הקישור"
      value={recipeLink}
      onChange={(e) => setRecipeLink(e.target.value)}
    />
    <label htmlFor="recipe-name">שם המתכון:</label>
    <input
      type="text"
      id="recipe-name"
      placeholder="הזן שם המתכון"
      value={recipeName}
      onChange={(e) => setRecipeName(e.target.value)}
    />
    <label htmlFor="recipe-description">תיאור המתכון:</label>
    <textarea
      id="recipe-description"
      placeholder="הזן תיאור למתכון"
      value={recipeDescription}
      onChange={(e) => setRecipeDescription(e.target.value)}
    />
  </>
);
