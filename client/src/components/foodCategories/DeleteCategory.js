// DeleteCategoryButton.js
import React from 'react';
import '../../style/FoodTypes.css';

const DeleteCategory = ({ isDeleteMode, toggleDeleteMode }) => {
  return (
    <button
      onClick={toggleDeleteMode}
      className={`delete-category-button ${isDeleteMode ? 'active' : ''}`}
    >
      {isDeleteMode ? 'בטל מחיקה' : 'מחק קטגוריה'}
    </button>
  );
};

export default DeleteCategory;
