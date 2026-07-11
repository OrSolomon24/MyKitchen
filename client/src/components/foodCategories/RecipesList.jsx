import React from 'react';
import '../../style/RecipesList.css';

const RecipesList = ({ dishes, selectedCategory, selectedCategoryName, onDishClick }) => {
  const selectedDishes = selectedCategory
    ? dishes.filter(dish => dish.categoryIds?.includes(selectedCategory))
    : dishes;

  return (
    <div className="dish-list">
      <h2>{selectedCategoryName || "כל המנות"}</h2>
      {selectedDishes.length > 0 ? (
        <div className="dish-grid">
          {selectedDishes.map((dish) => (
            <div key={dish.id} className="dish-card" onClick={() => onDishClick(dish.id)}>
              {dish.images?.[0] && (
                <div className="dish-card-image">
                  <img src={dish.images[0].url} alt={dish.name} />
                </div>
              )}
              <div className="dish-card-body">
                <span className="dish-name">{dish.name}</span>
                {dish.description && <p className="dish-description">{dish.description}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="message-container">
          <p>אין מנות בקטגוריה הזו</p>
        </div>
      )}
    </div>
  );
};

export default RecipesList;
