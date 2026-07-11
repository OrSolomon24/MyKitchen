// components/addRecipe/LinkToAgentForm.js
import React from 'react';
import { CategorySelection } from './CategorySelection';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Spinner } from '../ui/Spinner';

export const LinkToAgentForm = ({
  recipeLink,
  setRecipeLink,
  recipeName,
  setRecipeName,
  recipeDescription,
  setRecipeDescription,
  categories,
  categoriesLoading,
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
    <form className="flex w-full flex-col" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="recipe-link-agent" className="mb-2 block font-semibold text-text">
          קישור למתכון:
        </label>
        <Input
          type="url"
          id="recipe-link-agent"
          placeholder="הדבק כאן את הקישור למתכון"
          value={recipeLink}
          onChange={(e) => setRecipeLink(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="recipe-name-agent" className="mb-2 block font-semibold text-text">
          שם המתכון:
        </label>
        <Input
          type="text"
          id="recipe-name-agent"
          placeholder="הזן שם למתכון"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="recipe-description-agent" className="mb-2 block font-semibold text-text">
          תיאור המתכון:
        </label>
        <Textarea
          id="recipe-description-agent"
          placeholder="הזן תיאור למתכון"
          value={recipeDescription}
          onChange={(e) => setRecipeDescription(e.target.value)}
          required
        />
      </div>

      <CategorySelection
        categories={categories}
        isLoading={categoriesLoading}
        handleCategoryChange={handleCategoryChange}
        selectedCategories={selectedCategories}
      />

      <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
        {isLoading && <Spinner size="sm" colorClassName="border-white/40 border-t-white" />}
        {isLoading ? 'מייבא מתכון בעזרת AI...' : 'ייבוא מתכון בעזרת AI'}
      </Button>
    </form>
  );
};
