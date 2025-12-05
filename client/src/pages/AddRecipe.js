// pages/AddRecipe.js (or wherever this lives)
import React, { useState, useEffect } from 'react';
import { FormSelection } from '../components/addRecipe/FormSelection';
import { ManualRecipeForm } from '../components/addRecipe/ManualRecipeForm';
import { LinkRecipeForm } from '../components/addRecipe/LinkRecipeForm';
import { CategorySelection } from '../components/addRecipe/CategorySelection';
import { LinkToAgentForm } from '../components/addRecipe/LinkToAgentForm';
import { fetchCategories, addRecipe, importRecipeFromLinkWithAI } from '../utils/recipeUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    // Clean previous state when switching
    resetForm();
    setFormType(type);
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  // Existing submit for manual / simple link
  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!recipeName || !recipeDescription || (!ingredients && !recipeLink) || selectedCategories.length === 0) {
    toast.error('נא למלא את כל השדות ולבחור קטגוריה אחת לפחות');
    return;
  }

  // 🔹 normalize ingredients to array (one item per line)
  const ingredientsArray =
    formType === 'manual'
      ? ingredients
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line !== '')
      : [];

  const recipeData = {
    name: recipeName,
    description: recipeDescription,
    ingredients: ingredientsArray,          // 👈 now it's an array
    instruction: instruction || '',
    url: formType === 'link' ? recipeLink : '',
  };

  try {
    await addRecipe(recipeData, selectedCategories);
    toast.success('המתכון נוסף בהצלחה!');
    resetForm();
  } catch (error) {
    console.error(error);
    toast.error('אירעה שגיאה. נסה שוב.');
  }
};


  // New submit handler for AI-import path
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
  };

  return (
    <div className="add-recipe-container" dir="rtl">
      <h1>אין כמו מתכון חדש וטעים!</h1>

      {formType === '' && (
        <FormSelection handleFormSelection={handleFormSelection} />
      )}

      {/* Manual form (same as before) */}
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
          />
          <CategorySelection
            categories={categories}
            handleCategoryChange={handleCategoryChange}
            selectedCategories={selectedCategories}
          />
          <button type="submit">הוספת מתכון</button>
        </form>
      )}

      {/* Simple link form (same as before) */}
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
          <button type="submit">הוספת מתכון</button>
        </form>
      )}

      {/* New AI-import form */}
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


      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
};
