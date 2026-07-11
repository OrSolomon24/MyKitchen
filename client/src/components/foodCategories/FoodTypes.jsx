// components/foodCategories/FoodTypes.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AddCategory from './AddCategory';
import DeleteCategory from './DeleteCategory';
import { deleteCategory } from '../../api/categories';
import { ConfirmDialog } from '../ui/ConfirmDialog';

import '../../style/FoodTypes.css';

const FoodTypes = ({ categories, onCategoryClick, selectedCategory, refreshCategories }) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const confirmDeleteCategory = async () => {
    const categoryId = pendingDeleteId;
    setPendingDeleteId(null);

    try {
      await deleteCategory(categoryId);
      setIsDeleteMode(false);
      refreshCategories();
    } catch (error) {
      toast.error(error.message || 'שגיאה במחיקת הקטגוריה');
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
  };

  return (
    <div className="category-list">
      <h1>סוגי אוכל</h1>
      <ul>
        {categories.length ? (
          categories.map((category) => (
            <li
              key={category.id}
              onClick={() => {
                if (isDeleteMode) {
                  setPendingDeleteId(category.id);
                } else {
                  onCategoryClick(category.id, category.name);
                }
              }}
              className={selectedCategory === category.id ? 'selected' : ''}
            >
              {category.name}
            </li>
          ))
        ) : (
          <p>טוען קטגוריות...</p>
        )}
      </ul>
      <AddCategory refreshCategories={refreshCategories} />
      <DeleteCategory
        isDeleteMode={isDeleteMode}
        toggleDeleteMode={toggleDeleteMode}
      />
      {pendingDeleteId && (
        <ConfirmDialog
          title="מחיקת קטגוריה"
          message="האם אתה בטוח שברצונך למחוק את הקטגוריה?"
          danger
          onConfirm={confirmDeleteCategory}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
};

export default FoodTypes;
