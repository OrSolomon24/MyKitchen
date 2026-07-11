// pages/AddRecipe.js
import React, { useState, useEffect } from 'react';
import { FormSelection } from '../components/addRecipe/FormSelection';
import { ManualRecipeForm } from '../components/addRecipe/ManualRecipeForm';
import { LinkRecipeForm } from '../components/addRecipe/LinkRecipeForm';
import { CategorySelection } from '../components/addRecipe/CategorySelection';
import { LinkToAgentForm } from '../components/addRecipe/LinkToAgentForm';
import { addRecipe, uploadDishImage } from '../api/dishes';
import { importRecipeFromLinkWithAI } from '../api/recipes';
import { fetchCategories } from '../api/categories';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';
import '../style/AddRecipe.css';

export const AddRecipe = () => {
  const [formType, setFormType] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instruction, setInstruction] = useState('');
  const [recipeLink, setRecipeLink] = useState('');
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [recipeImages, setRecipeImages] = useState([]);   // 👈 NEW

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error(error);
        toast.error('שגיאה בטעינת הקטגוריות');
      }
    };
    loadCategories();
  }, []);

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
      // 1) Create the recipe (one dish, linked to every selected category)
      const newDish = await addRecipe(recipeData, selectedCategories);

      // 2) Upload images (if any) to the created dish
      if (formType === 'manual' && recipeImages.length > 0) {
        for (const file of recipeImages) {
          await uploadDishImage(newDish.id, file);
        }
      }

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
      setIsAgentLoading(true);

      await importRecipeFromLinkWithAI({
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
    } finally {
      setIsAgentLoading(false);
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
    <div className="add-recipe-container">
      <h1>אין כמו מתכון חדש וטעים!</h1>

      {formType === '' && (
        <FormSelection handleFormSelection={handleFormSelection} />
      )}

      {formType === 'manual' && (
        <form onSubmit={handleSubmit}>
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
            handleCategoryChange={handleCategoryChange}
            selectedCategories={selectedCategories}
          />
          <Button type="submit" variant="primary">הוספת מתכון</Button>
        </form>
      )}

      {formType === 'link' && (
        <form onSubmit={handleSubmit}>
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
            handleCategoryChange={handleCategoryChange}
            selectedCategories={selectedCategories}
          />
          <Button type="submit" variant="primary">הוספת מתכון</Button>
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
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          onSubmit={handleAgentSubmit}
          isLoading={isAgentLoading}
        />
      )}
    </div>
  );
};
