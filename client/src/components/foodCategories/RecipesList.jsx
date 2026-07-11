import React from 'react';
import { DishCardSkeleton } from '../skeletons/DishCardSkeleton';

const RecipesList = ({ dishes, selectedCategory, selectedCategoryName, onDishClick, isLoading }) => {
  const selectedDishes = selectedCategory
    ? dishes.filter(dish => dish.categoryIds?.includes(selectedCategory))
    : dishes;

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-primary">{selectedCategoryName || "כל המנות"}</h2>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {Array.from({ length: 6 }).map((_, i) => (
            <DishCardSkeleton key={i} />
          ))}
        </div>
      ) : selectedDishes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {selectedDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => onDishClick(dish.id)}
              className="cursor-pointer overflow-hidden rounded-md bg-surface shadow-sm transition-all duration-150 hover:-translate-y-1 hover:shadow-md active:translate-y-0"
            >
              {dish.images?.[0] && (
                <div className="aspect-[4/3] w-full overflow-hidden bg-surface-muted">
                  <img
                    src={dish.images[0].url}
                    alt={dish.name}
                    loading="lazy"
                    width={220}
                    height={165}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <span className="mb-1 block font-bold text-text">{dish.name}</span>
                {dish.description && (
                  <p className="m-0 line-clamp-2 text-sm text-text-muted">{dish.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="my-8 text-center">
          <p className="text-md font-semibold text-text-muted">אין מנות בקטגוריה הזו</p>
        </div>
      )}
    </div>
  );
};

export default RecipesList;
