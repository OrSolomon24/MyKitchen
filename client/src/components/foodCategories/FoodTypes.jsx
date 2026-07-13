import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AddCategory from './AddCategory';
import DeleteCategory from './DeleteCategory';
import { useDeleteCategoryMutation } from '../../api/useCategoriesQueries';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { CategoryListSkeleton } from '../skeletons/CategoryListSkeleton';

const chipClass = (isSelected) =>
  `min-h-11 flex-1 basis-auto cursor-pointer rounded-full px-4 py-2.5 text-center font-medium transition-colors duration-150 md:flex-none md:text-start ${
    isSelected
      ? 'bg-ink font-semibold text-text-on-dark'
      : 'bg-surface-muted text-text hover:bg-primary-tint hover:text-primary-dark'
  }`;

const FoodTypes = ({ categories, onCategoryClick, selectedCategory, isLoading }) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const confirmDeleteCategory = async () => {
    const categoryId = pendingDeleteId;
    setPendingDeleteId(null);

    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      setIsDeleteMode(false);
    } catch (error) {
      toast.error(error.message || 'שגיאה במחיקת הקטגוריה');
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
  };

  return (
    <div className="flex w-full flex-col items-stretch rounded-lg bg-surface p-5 shadow-sm md:sticky md:top-20 md:w-[260px] md:shrink-0">
      <h2 className="mb-4 font-display text-md font-bold text-ink">קטגוריות</h2>
      {isLoading ? (
        <CategoryListSkeleton />
      ) : (
        <ul className="mb-4 flex flex-row flex-wrap gap-2 md:flex-col">
          <li>
            <button
              type="button"
              onClick={() => onCategoryClick(null)}
              className={`${chipClass(!selectedCategory)} w-full`}
            >
              הכל
            </button>
          </li>
          {categories.length ? (
            categories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isDeleteMode) {
                      setPendingDeleteId(category.id);
                    } else {
                      onCategoryClick(category.id, category.name);
                    }
                  }}
                  className={`${chipClass(selectedCategory === category.id)} w-full ${
                    isDeleteMode ? 'ring-2 ring-danger/40' : ''
                  }`}
                >
                  {category.name}
                </button>
              </li>
            ))
          ) : (
            <p className="text-sm text-text-muted">אין קטגוריות עדיין</p>
          )}
        </ul>
      )}
      <AddCategory />
      <DeleteCategory isDeleteMode={isDeleteMode} toggleDeleteMode={toggleDeleteMode} />
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
