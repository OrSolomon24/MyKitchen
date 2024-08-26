// components/addRecipe/ManualRecipeForm.js
import React from 'react';

export const ManualRecipeForm = ({
  recipeName,
  setRecipeName,
  recipeDescription,
  setRecipeDescription,
  ingredients,
  setIngredients,
  instruction,
  setInstruction,
}) => (
  <>
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
    <label htmlFor="ingredients">מצרכים:</label>
    <textarea
      id="ingredients"
      placeholder="הזן את המצרכים"
      value={ingredients}
      onChange={(e) => setIngredients(e.target.value)}
    />
    <label htmlFor="instruction">הוראות הכנה:</label>
    <textarea
      id="instruction"
      placeholder="הזן את הוראות ההכנה"
      value={instruction}
      onChange={(e) => setInstruction(e.target.value)}
    />
  </>
);
