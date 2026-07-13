import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import FoodTypes from '../components/foodCategories/FoodTypes';
import RecipesList from '../components/foodCategories/RecipesList';
import { useCategories } from '../api/useCategoriesQueries';
import { useDishes } from '../api/useDishesQueries';

export const FoodCategories = () => {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: dishes = [], isLoading: dishesLoading } = useDishes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const selectedCategory = searchParams.get('category');
  const selectedCategoryName = useMemo(
    () => categories.find((category) => category.id === selectedCategory)?.name || '',
    [categories, selectedCategory]
  );

  const filteredDishes = useMemo(() => {
    let filtered = dishes;

    if (selectedCategory) {
      filtered = filtered.filter((dish) => dish.categoryIds?.includes(selectedCategory));
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((dish) =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [dishes, selectedCategory, searchTerm]);

  const handleCategoryClick = (categoryId) => {
    setSearchParams(categoryId ? { category: categoryId } : {});
    setSearchTerm('');
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(selectedCategory || searchTerm.trim());

  const handleDishClick = (dishId) => {
    const selectedDish = dishes.find((dish) => dish.id === dishId);
    navigate(`/recipe/${dishId}`, {
      state: {
        dish: selectedDish,
        categoryId: selectedCategory || null,
        categoryName: selectedCategoryName || '',
      },
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-14 pt-6 md:px-6 md:pt-8">
      <header className="mb-6">
        <h1 className="m-0 font-display text-2xl font-black text-ink">המתכונים</h1>
        {!dishesLoading && (
          <p className="m-0 mt-1 text-sm text-text-muted">
            {dishes.length} מתכונים שמורים במטבח
          </p>
        )}
      </header>

      <div className="flex flex-col items-start gap-6 md:flex-row">
        <FoodTypes
          categories={categories}
          isLoading={categoriesLoading}
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
        />

        <div className="min-w-0 w-full flex-1">
          <div className="relative mb-4">
            <FaSearch
              aria-hidden="true"
              className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-text-muted/70"
            />
            <input
              type="search"
              placeholder="חיפוש מנה..."
              value={searchTerm}
              onChange={handleSearchTermChange}
              aria-label="חיפוש מנה"
              className="w-full rounded-full border-[1.5px] border-border bg-surface py-3 pe-11 ps-11 text-base text-text shadow-sm transition-colors placeholder:text-text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="ניקוי חיפוש"
                className="absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-text-muted">מסננים פעילים:</span>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => handleCategoryClick(null)}
                  className="flex items-center gap-2 rounded-full bg-primary-tint px-3 py-1.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary hover:text-text-on-dark"
                >
                  {selectedCategoryName}
                  <FaTimes aria-hidden="true" className="text-xs" />
                </button>
              )}
              {searchTerm.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="flex items-center gap-2 rounded-full bg-accent-tint px-3 py-1.5 text-sm font-semibold text-accent-dark transition-colors hover:bg-accent hover:text-text-on-dark"
                >
                  ”{searchTerm}”
                  <FaTimes aria-hidden="true" className="text-xs" />
                </button>
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-text-muted underline underline-offset-4 transition-colors hover:text-danger"
              >
                ניקוי הכל
              </button>
            </div>
          )}

          <RecipesList
            dishes={filteredDishes}
            isLoading={dishesLoading}
            selectedCategoryName={selectedCategoryName}
            searchTerm={searchTerm}
            onDishClick={handleDishClick}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>
    </div>
  );
};
