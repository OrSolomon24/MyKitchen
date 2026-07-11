// components/addRecipe/LinkToAgentForm.js
import React from 'react';
import { CategorySelection } from './CategorySelection';
import { Button } from '../ui/Button';

export const LinkToAgentForm = ({
  recipeLink,
  setRecipeLink,
  recipeName,
  setRecipeName,
  recipeDescription,
  setRecipeDescription,
  categories,
  selectedCategories,
  handleCategoryChange,
  onSubmit,
  isLoading,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="link-to-agent-form" onSubmit={handleSubmit}>
      <label htmlFor="recipe-link-agent">קישור למתכון:</label>
      <input
        type="url"
        id="recipe-link-agent"
        placeholder="הדבק כאן את הקישור למתכון"
        value={recipeLink}
        onChange={(e) => setRecipeLink(e.target.value)}
        required
      />

      <label htmlFor="recipe-name-agent">שם המתכון:</label>
      <input
        type="text"
        id="recipe-name-agent"
        placeholder="הזן שם למתכון"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        required
      />

      <label htmlFor="recipe-description-agent">תיאור המתכון:</label>
      <textarea
        id="recipe-description-agent"
        placeholder="הזן תיאור למתכון"
        value={recipeDescription}
        onChange={(e) => setRecipeDescription(e.target.value)}
        required
      />

      <CategorySelection
        categories={categories}
        handleCategoryChange={handleCategoryChange}
        selectedCategories={selectedCategories}
      />

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'מייבא מתכון בעזרת AI...' : 'ייבוא מתכון בעזרת AI'}
      </Button>
    </form>
  );
};
