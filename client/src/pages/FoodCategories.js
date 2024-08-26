// pages/FoodCategories.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodTypes from '../components/foodCategories/FoodTypes';
import RecipesList from '../components/foodCategories/RecipesList';
import { fetchCategories, fetchDishes } from '../utils/foodCategoriesUtils';
import '../style/FoodCategories.css';

export const FoodCategories = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoriesAndDishes();
  }, []);

  const fetchCategoriesAndDishes = async () => {
    try {
      const categoryData = await fetchCategories();
      setCategories(categoryData);

      const dishData = await fetchDishes();
      setDishes(dishData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const refreshCategories = async () => {
    try {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    } catch (error) {
      console.error('Error refreshing categories:', error);
    }
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
  };

  const handleDishClick = (dishId) => {
    const selectedDish = dishes.find(dish => dish.dishid === dishId);
    navigate(`/recipe/${dishId}`, { state: { dish: selectedDish } });
  };

  return (
    <div className="food-categories-container">
      <FoodTypes
        categories={categories}
        onCategoryClick={handleCategoryClick}
        selectedCategory={selectedCategory}
        refreshCategories={refreshCategories}
      />
      <RecipesList
        dishes={dishes}
        selectedCategory={selectedCategory}
        selectedCategoryName={selectedCategoryName}
        onDishClick={handleDishClick}
      />
    </div>
  );
};