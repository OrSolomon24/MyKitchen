import React from 'react';
import { DishCardSkeleton } from '../skeletons/DishCardSkeleton';
import { DishCard } from '../common/DishCard';
import { LogoMark } from '../common/Logo';

const RecipesList = ({
  dishes,
  selectedCategoryName,
  searchTerm,
  onDishClick,
  isLoading,
  onClearFilters,
  hasActiveFilters,
}) => {
  const emptyMessage = searchTerm?.trim()
    ? `לא נמצאו מנות שמתאימות לחיפוש ”${searchTerm.trim()}”`
    : selectedCategoryName
      ? `אין עדיין מנות בקטגוריה ”${selectedCategoryName}”`
      : 'אין עדיין מתכונים במטבח';

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline gap-2">
        <h2 className="m-0 font-display text-lg font-bold text-ink">
          {selectedCategoryName || 'כל המנות'}
        </h2>
        {!isLoading && (
          <span className="text-sm text-text-muted">· {dishes.length} מתכונים</span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {Array.from({ length: 6 }).map((_, i) => (
            <DishCardSkeleton key={i} />
          ))}
        </div>
      ) : dishes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} onClick={() => onDishClick(dish.id)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-lg bg-surface px-6 py-12 text-center shadow-sm">
          <LogoMark className="h-16 w-16 opacity-30" />
          <p className="m-0 text-md font-semibold text-text">{emptyMessage}</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full bg-primary px-5 py-2.5 font-semibold text-text-on-dark transition-colors hover:bg-primary-dark"
            >
              הצגת כל המתכונים
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipesList;
