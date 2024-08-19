// FoodCategories.js
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

    const selectedDishes = dishes.filter(dish => dish.categoryid === selectedCategory);

    return (
        <div className="food-categories-container">
            <FoodTypes 
                categories={categories}
                onCategoryClick={handleCategoryClick}
                selectedCategory={selectedCategory}
                refreshCategories={refreshCategories}
            />
            
            <div className="dish-list">
                {!selectedCategory ? (
                    <div className="message-container">
                <p>תבחרי קטגוריה על מנת לראות את המנות</p>
            </div>
                ) : (
                    <>
                        <h2>מאכלים בקטגוריה: {selectedCategoryName}</h2>
                        <ul>
                            {selectedDishes.length > 0 ? (
                                selectedDishes.map((dish) => (
                                    <li key={dish.dishid} onClick={() => handleDishClick(dish.dishid)}>
                                        <span>{dish.name}</span>: {dish.description}
                                    </li>
                                ))
                            ) : (
                                <div className="message-container">
                                    <p>עדיין אין מנות בקטגוריה הזו</p>
                                </div>
                            )}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};
