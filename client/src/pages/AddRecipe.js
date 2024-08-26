// pages/AddRecipe.js
import React, { useState, useEffect } from 'react';
import { FormSelection } from '../components/addRecipe/FormSelection';
import { ManualRecipeForm } from '../components/addRecipe/ManualRecipeForm';
import { LinkRecipeForm } from '../components/addRecipe/LinkRecipeForm';
import { CategorySelection } from '../components/addRecipe/CategorySelection';
import { fetchCategories, addRecipe } from '../utils/recipeUtils';
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

  useEffect(() => {
    const loadCategories = async () => {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    };
    loadCategories();
  }, []);

  const handleFormSelection = (type) => setFormType(type);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
    console.log("Selected Categories:", selectedCategories);
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!recipeName || !recipeDescription || (!ingredients && !recipeLink) || selectedCategories.length === 0) {
      alert('Please fill out all fields and select at least one category.');
      return;
    }

    const recipeData = {
      name: recipeName,
      description: recipeDescription,
      ingredients: ingredients || '',
      instruction: instruction || '',
      url: formType === 'link' ? recipeLink : '',
    };

    try {
      await addRecipe(recipeData, selectedCategories);
      alert('Recipe added successfully!');
      resetForm();
    } catch (error) {
      alert('Error adding recipe. Please try again.');
    }
  };

  const resetForm = () => {
    setFormType('');
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
      {formType === '' && <FormSelection handleFormSelection={handleFormSelection} />}
      {(formType === 'manual' || formType === 'link') && (
        <form onSubmit={handleSubmit}>
          {formType === 'manual' && (
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
          )}
          {formType === 'link' && (
            <LinkRecipeForm
              recipeLink={recipeLink}
              setRecipeLink={setRecipeLink}
              recipeName={recipeName}
              setRecipeName={setRecipeName}
              recipeDescription={recipeDescription}
              setRecipeDescription={setRecipeDescription}
            />
          )}
          <CategorySelection
            categories={categories}
            handleCategoryChange={handleCategoryChange}
            selectedCategories={selectedCategories}
          />
          <button type="submit">הוספת מתכון</button>
        </form>
      )}
    </div>
  );
};
