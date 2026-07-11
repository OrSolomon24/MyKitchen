// components/foodCategories/AddCategory.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addCategory } from '../../api/categories';
import { PromptDialog } from '../ui/PromptDialog';
import { Button } from '../ui/Button';

const AddCategory = ({ refreshCategories }) => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const handleAddCategory = async (name) => {
    setIsPromptOpen(false);
    try {
      await addCategory(name);
      refreshCategories();
    } catch (error) {
      toast.error('שגיאה בהוספת קטגוריה');
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsPromptOpen(true)} className="add-category-button">
        הוסף קטגוריה
      </Button>
      {isPromptOpen && (
        <PromptDialog
          title="קטגוריה חדשה"
          placeholder="שם הקטגוריה"
          onConfirm={handleAddCategory}
          onCancel={() => setIsPromptOpen(false)}
        />
      )}
    </>
  );
};

export default AddCategory;
