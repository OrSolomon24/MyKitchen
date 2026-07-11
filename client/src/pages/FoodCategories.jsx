import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

  const handleDishClick = (dishId) => {
    const selectedDish = dishes.find(dish => dish.id === dishId);
    navigate(`/recipe/${dishId}`, {
      state: {
        dish: selectedDish,
        categoryId: selectedCategory || null,
        categoryName: selectedCategoryName || '',
      },
    });
  };

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 p-4 md:flex-row md:p-6">
      <FoodTypes
        categories={categories}
        isLoading={categoriesLoading}
        onCategoryClick={handleCategoryClick}
        selectedCategory={selectedCategory}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-5">
          <input
            type="text"
            placeholder="חיפוש מנה..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full rounded-full border-[1.5px] border-border bg-surface px-4 py-3 text-base text-text focus:outline-none focus:border-primary"
          />
        </div>
        <RecipesList
          dishes={filteredDishes}
          isLoading={dishesLoading}
          selectedCategory={selectedCategory}
          selectedCategoryName={selectedCategoryName}
          onDishClick={handleDishClick}
        />
      </div>
    </div>
  );
};
