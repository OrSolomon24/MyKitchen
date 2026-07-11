// components/addRecipe/LinkRecipeForm.js
import React from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

export const LinkRecipeForm = ({
  recipeLink,
  setRecipeLink,
  recipeName,
  setRecipeName,
  recipeDescription,
  setRecipeDescription,
}) => (
  <>
    <div className="mb-4">
      <label htmlFor="recipe-link" className="mb-2 block font-semibold text-text">
        קישור למתכון:
      </label>
      <Input
        type="url"
        id="recipe-link"
        placeholder="הזן את הקישור"
        value={recipeLink}
        onChange={(e) => setRecipeLink(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label htmlFor="recipe-name" className="mb-2 block font-semibold text-text">
        שם המתכון:
      </label>
      <Input
        type="text"
        id="recipe-name"
        placeholder="הזן שם המתכון"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label htmlFor="recipe-description" className="mb-2 block font-semibold text-text">
        תיאור המתכון:
      </label>
      <Textarea
        id="recipe-description"
        placeholder="הזן תיאור למתכון"
        value={recipeDescription}
        onChange={(e) => setRecipeDescription(e.target.value)}
      />
    </div>
  </>
);
