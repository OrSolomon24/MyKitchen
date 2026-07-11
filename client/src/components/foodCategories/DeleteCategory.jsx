// DeleteCategoryButton.js
import React from 'react';
import { Button } from '../ui/Button';
import '../../style/FoodTypes.css';

const DeleteCategory = ({ isDeleteMode, toggleDeleteMode }) => {
  return (
    <Button
      variant={isDeleteMode ? 'danger' : 'ghost'}
      onClick={toggleDeleteMode}
      className="delete-category-button"
    >
      {isDeleteMode ? 'בטל מחיקה' : 'מחק קטגוריה'}
    </Button>
  );
};

export default DeleteCategory;
