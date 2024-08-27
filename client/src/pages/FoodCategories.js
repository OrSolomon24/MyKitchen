import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodTypes from '../components/foodCategories/FoodTypes';
import RecipesList from '../components/foodCategories/RecipesList';
import { fetchCategories, fetchDishes } from '../utils/foodCategoriesUtils';
import '../style/FoodCategories.css';

export const FoodCategories = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoriesAndDishes();
  }, []);

  useEffect(() => {
    filterDishes();
  }, [selectedCategory, searchTerm, dishes]);

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
    setSearchTerm('');
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setSelectedCategory(null); 
      setSelectedCategoryName(''); 
    }
  };

  const handleDishClick = (dishId) => {
    const selectedDish = dishes.find(dish => dish.dishid === dishId);
    navigate(`/recipe/${dishId}`, { state: { dish: selectedDish } });
  };

  const filterDishes = () => {
    let filtered = dishes;

    if (selectedCategory) {
      filtered = filtered.filter(dish => dish.categoryid === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDishes(filtered);
  };

  return (
    <div className="food-categories-container">

        <FoodTypes
          categories={categories}
          onCategoryClick={handleCategoryClick}
          selectedCategory={selectedCategory}
          refreshCategories={refreshCategories}
        />
        <div className="recipt-list">
      <div className="sidebar">
        <input
          type="text"
          className="search-bar"
          placeholder="חיפוש מנה..."
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
      <RecipesList
        dishes={filteredDishes}
        selectedCategory={selectedCategory}
        selectedCategoryName={selectedCategoryName}
        onDishClick={handleDishClick}
      />
      </div>
    </div>
  );
};
