// pages/AddRecipe.js
import React, { useState } from 'react';
import { FormSelection } from '../components/addRecipe/FormSelection';
import { ManualRecipeForm } from '../components/addRecipe/ManualRecipeForm';
import { LinkRecipeForm } from '../components/addRecipe/LinkRecipeForm';
import { CategorySelection } from '../components/addRecipe/CategorySelection';
import { LinkToAgentForm } from '../components/addRecipe/LinkToAgentForm';
import { useAddRecipeMutation } from '../api/useDishesQueries';
import { useImportRecipeFromLinkWithAI } from '../api/useRecipeAiImport';
import { useCategories } from '../api/useCategoriesQueries';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';

export const AddRecipe = () => {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const addRecipeMutation = useAddRecipeMutation();
  const importRecipeMutation = useImportRecipeFromLinkWithAI();

  const [formType, setFormType] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instruction, setInstruction] = useState('');
  const [recipeLink, setRecipeLink] = useState('');
  const [recipeImages, setRecipeImages] = useState([]);   // 👈 NEW

  const handleFormSelection = (type) => {
    resetForm();
    setFormType(type);
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleImagesChange = (files) => {
    setRecipeImages(files);
  };

  // Manual / link submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!recipeName || !recipeDescription || (!ingredients && !recipeLink) || selectedCategories.length === 0) {
      toast.error('נא למלא את כל השדות ולבחור קטגוריה אחת לפחות');
      return;
    }

    const ingredientsArray =
      formType === 'manual'
        ? ingredients
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '')
        : [];

    const stepsArray =
      formType === 'manual'
        ? instruction
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '')
        : [];

    const recipeData = {
      name: recipeName,
      description: recipeDescription,
      ingredients: ingredientsArray,
      steps: stepsArray,
      sourceUrl: formType === 'link' ? recipeLink : null,
    };

    try {
      await addRecipeMutation.mutateAsync({
        recipeData,
        categoryIds: selectedCategories,
        images: formType === 'manual' ? recipeImages : [],
      });

      toast.success('המתכון נוסף בהצלחה!');
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('אירעה שגיאה. נסה שוב.');
    }
  };

  const handleAgentSubmit = async () => {
    if (!recipeLink) {
      toast.error('נא להזין קישור למתכון');
      return;
    }
    if (!recipeName) {
      toast.error('נא להזין שם למתכון');
      return;
    }
    if (!recipeDescription) {
      toast.error('נא להזין תיאור למתכון');
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error('נא לבחור לפחות קטגוריה אחת');
      return;
    }

    try {
      await importRecipeMutation.mutateAsync({
        url: recipeLink,
        name: recipeName,
        description: recipeDescription,
        categoryIds: selectedCategories,
      });

      toast.success('המתכון יובא בהצלחה בעזרת AI!');
      resetForm();
      setFormType('');
    } catch (error) {
      console.error(error);
      toast.error('אירעה שגיאה בייבוא המתכון. נסה שוב.');
    }
  };

  const resetForm = () => {
    setRecipeName('');
    setRecipeDescription('');
    setIngredients('');
    setInstruction('');
    setRecipeLink('');
    setSelectedCategories([]);
    setRecipeImages([]);           // 👈 reset images
  };

  return (
    <div className="mx-auto my-6 mb-16 flex max-w-[640px] flex-col items-center rounded-lg bg-surface p-6 shadow-md md:my-8">
      <h1 className="mb-5 text-center text-xl font-bold text-primary">אין כמו מתכון חדש וטעים!</h1>

      {formType === '' && (
        <FormSelection handleFormSelection={handleFormSelection} />
      )}

      {formType === 'manual' && (
        <form onSubmit={handleSubmit} className="flex w-full flex-col">
          <ManualRecipeForm
            recipeName={recipeName}
            setRecipeName={setRecipeName}
            recipeDescription={recipeDescription}
            setRecipeDescription={setRecipeDescription}
            ingredients={ingredients}
            setIngredients={setIngredients}
            instruction={instruction}
            setInstruction={setInstruction}
            onImagesChange={handleImagesChange}   // 👈 pass handler
          />
          <CategorySelection
            categories={categories}
            isLoading={categoriesLoading}
            handleCategoryChange={handleCategoryChange}
            selectedCategories={selectedCategories}
          />
          <Button type="submit" variant="primary" className="w-full">הוספת מתכון</Button>
        </form>
      )}

      {formType === 'link' && (
        <form onSubmit={handleSubmit} className="flex w-full flex-col">
          <LinkRecipeForm
            recipeLink={recipeLink}
            setRecipeLink={setRecipeLink}
            recipeName={recipeName}
            setRecipeName={setRecipeName}
            recipeDescription={recipeDescription}
            setRecipeDescription={setRecipeDescription}
          />
          <CategorySelection
            categories={categories}
            isLoading={categoriesLoading}
            handleCategoryChange={handleCategoryChange}
            selectedCategories={selectedCategories}
          />
          <Button type="submit" variant="primary" className="w-full">הוספת מתכון</Button>
        </form>
      )}

      {formType === 'agent' && (
        <LinkToAgentForm
          recipeLink={recipeLink}
          setRecipeLink={setRecipeLink}
          recipeName={recipeName}
          setRecipeName={setRecipeName}
          recipeDescription={recipeDescription}
          setRecipeDescription={setRecipeDescription}
          categories={categories}
          categoriesLoading={categoriesLoading}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          onSubmit={handleAgentSubmit}
          isLoading={importRecipeMutation.isPending}
        />
      )}
    </div>
  );
};
