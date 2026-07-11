// components/addRecipe/ManualRecipeForm.js
import React from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { FileInputButton } from '../ui/FileInputButton';

export const ManualRecipeForm = ({
  recipeName,
  setRecipeName,
  recipeDescription,
  setRecipeDescription,
  ingredients,
  setIngredients,
  instruction,
  setInstruction,
  onImagesChange,          // 👈 NEW
}) => (
  <>
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

    <div className="mb-4">
      <label htmlFor="ingredients" className="mb-2 block font-semibold text-text">
        מצרכים:
      </label>
      <Textarea
        id="ingredients"
        placeholder="הזן את המצרכים"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
    </div>

    <div className="mb-4">
      <label htmlFor="instruction" className="mb-2 block font-semibold text-text">
        הוראות הכנה:
      </label>
      <Textarea
        id="instruction"
        placeholder="הזן את הוראות ההכנה"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
      />
    </div>

    {/* 🔹 Images input */}
    <div className="mb-4">
      <label className="mb-2 block font-semibold text-text">תמונות:</label>
      <FileInputButton
        id="recipe-images"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          onImagesChange && onImagesChange(files);
        }}
      >
        📸 הוספת תמונות
      </FileInputButton>
    </div>
  </>
);
