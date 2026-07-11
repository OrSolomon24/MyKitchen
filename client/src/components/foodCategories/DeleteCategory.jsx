// DeleteCategoryButton.js
import React from 'react';
import { Button } from '../ui/Button';

const DeleteCategory = ({ isDeleteMode, toggleDeleteMode }) => {
  return (
    <Button
      variant={isDeleteMode ? 'danger' : 'ghost'}
      onClick={toggleDeleteMode}
      className="w-full"
    >
      {isDeleteMode ? 'בטל מחיקה' : 'מחק קטגוריה'}
    </Button>
  );
};

export default DeleteCategory;
