import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodTypes from '../components/FoodTypes';
import RecipesList from '../components/RecipesList';

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
            const categoryResponse = await fetch('http://localhost:5000/api/food/category');
            if (!categoryResponse.ok) {
                throw new Error('Network response was not ok for categories');
            }
            const categoryData = await categoryResponse.json();
            setCategories(categoryData);

            const dishResponse = await fetch('http://localhost:5000/api/food/dish');
            if (!dishResponse.ok) {
                throw new Error('Network response was not ok for dishes');
            }
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
            const response = await fetch('http://localhost:5000/api/food/category');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
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
