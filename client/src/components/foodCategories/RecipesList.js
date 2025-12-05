import React from 'react';
import '../../style/RecipesList.css';

const RecipesList = ({ dishes, selectedCategory, selectedCategoryName, onDishClick }) => {
  const selectedDishes = selectedCategory
    ? dishes.filter(dish => dish.categoryid === selectedCategory)
    : dishes;

  return (
    <div className="dish-list">
      <h2>{selectedCategoryName || "כל המנות"}</h2>
      <ul>
        {selectedDishes.length > 0 ? (
          selectedDishes.map((dish) => (
            <li key={dish._id} onClick={() => onDishClick(dish._id)}>
              <span className="dish-name">{dish.name}</span>: {dish.description}
            </li>
          ))
        ) : (
          <div className="message-container">
            <p>אין מנות בקטגוריה הזו</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default RecipesList;
