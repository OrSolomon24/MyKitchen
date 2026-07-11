// components/addRecipe/CategorySelection.js
import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const CategorySelection = ({ categories, handleCategoryChange, selectedCategories, isLoading }) => (
  <fieldset className="mb-5 rounded-md border-[1.5px] border-border p-4">
    <legend className="px-2 font-semibold text-primary">בחר קטגוריות:</legend>
    {isLoading ? (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9" />
        ))}
      </div>
    ) : categories.length > 0 ? (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((category) => (
          <label
            key={category.id}
            htmlFor={`category-${category.id}`}
            className="flex min-h-11 cursor-pointer items-center gap-2"
          >
            <input
              type="checkbox"
              id={`category-${category.id}`}
              value={category.id.toString()}
              onChange={handleCategoryChange}
              checked={selectedCategories.includes(category.id.toString())}
              className="h-6 w-6 min-w-6 shrink-0 cursor-pointer rounded-sm border-[1.5px] border-border bg-surface accent-primary"
            />
            <span className="text-sm text-text">{category.name}</span>
          </label>
        ))}
      </div>
    ) : (
      <p className="text-sm text-text-muted">אין קטגוריות עדיין</p>
    )}
  </fieldset>
);
