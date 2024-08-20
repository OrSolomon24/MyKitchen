// FoodCategories.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodTypes from '../components/food/FoodTypes';
import RecipesList from '../components/food/RecipesList';
import '../style/FoodCategories.css';

const apiUrl = process.env.REACT_APP_API_URL;

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
      // Fetch categories
      const categoryResponse = await fetch(`${apiUrl}/api/food/category`);
      if (!categoryResponse.ok) throw new Error('Error fetching categories');
      const categoryData = await categoryResponse.json();
      setCategories(categoryData);

      // Fetch dishes
      const dishResponse = await fetch(`${apiUrl}/api/food/dish`);
      if (!dishResponse.ok) throw new Error('Error fetching dishes');
      const dishData = await dishResponse.json();
      setDishes(dishData);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const refreshCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/food/category`);
      if (!response.ok) throw new Error('Error refreshing categories');
      const categoryData = await response.json();
      setCategories(categoryData);
    } catch (error) {
      console.error('Error refreshing categories:', error);
    }
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
