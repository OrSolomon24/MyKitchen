// components/foodCategories/AddCategory.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAddCategoryMutation } from '../../api/useCategoriesQueries';
import { PromptDialog } from '../ui/PromptDialog';
import { Button } from '../ui/Button';

const AddCategory = () => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const addCategoryMutation = useAddCategoryMutation();

  const handleAddCategory = async (name) => {
    setIsPromptOpen(false);
    try {
      await addCategoryMutation.mutateAsync(name);
    } catch (error) {
      toast.error('שגיאה בהוספת קטגוריה');
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsPromptOpen(true)} className="mb-2 w-full">
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
