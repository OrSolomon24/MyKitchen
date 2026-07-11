// components/recipes/RecipeForm.js
import React from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

const fieldLabel = 'mt-3 mb-2 block font-semibold text-primary';

export const RecipeForm = ({ dish, handleChange }) => {
  return (
    <div className="rounded-md bg-surface p-5 shadow-sm">
      {/* Conditionally render the name, URL, and description fields if a URL is present */}
      {dish.sourceUrl ? (
        <>
          <label htmlFor="name" className={fieldLabel}>שם המתכון</label>
          <Input
            id="name"
            type="text"
            value={dish.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <label htmlFor="sourceUrl" className={fieldLabel}>URL</label>
          <Input
            id="sourceUrl"
            type="text"
            value={dish.sourceUrl}
            onChange={(e) => handleChange('sourceUrl', e.target.value)}
          />

          <label htmlFor="description" className={fieldLabel}>תיאור</label>
          <Textarea
            id="description"
            value={dish.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </>
      ) : (
        <>
          <label htmlFor="name" className={fieldLabel}>שם המתכון</label>
          <Input
            id="name"
            type="text"
            value={dish.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <label htmlFor="description" className={fieldLabel}>תיאור</label>
          <Textarea
            id="description"
            value={dish.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <label htmlFor="ingredients" className={fieldLabel}>מרכיבים</label>
          <Textarea
            id="ingredients"
            value={dish.ingredients?.join('\n') || ''}
            onChange={(e) => handleChange('ingredients', e.target.value)}
          />

          <label htmlFor="steps" className={fieldLabel}>הוראות הכנה</label>
          <Textarea
            id="steps"
            value={dish.steps?.join('\n') || ''}
            onChange={(e) => handleChange('steps', e.target.value)}
          />
        </>
      )}
    </div>
  );
};
