// RecipesList.js
import React from 'react';
import '../../style/RecipesList.css';

const RecipesList = ({ dishes, selectedCategory, selectedCategoryName, onDishClick }) => {
  const selectedDishes = dishes.filter(dish => dish.categoryid === selectedCategory);

  return (
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
                <li key={dish.dishid} onClick={() => onDishClick(dish.dishid)}>
                  <span className="dish-name">{dish.name}</span>: {dish.description}
                </li>
              ))
            ) : (
              <div className="message-container">
                <p>אין מנות בקטגוריה הזו</p>
              </div>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default RecipesList;
