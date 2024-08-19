import React, { useState, useEffect } from 'react';
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
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/food/category');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const categoryData = await response.json();
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFormSelection = (type) => {
    setFormType(type);
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure that all fields are filled out
    if (!recipeName || !recipeDescription || (!ingredients && !recipeLink) || selectedCategories.length === 0) {
      alert('Please fill out all fields and select at least one category.');
      return;
    }

    // Prepare the data to be sent to the server
    const recipeData = {
      name: recipeName,
      description: recipeDescription,
      ingredients: ingredients || '',
      instruction: instruction || '',
      url: formType === 'link' ? recipeLink : '',
    };

    try {
      // Send a POST request for each selected category
      await Promise.all(selectedCategories.map(async (categoryId) => {
        const response = await fetch('http://localhost:5000/api/food/dish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...recipeData,
            categoryid: parseInt(categoryId, 10),
            dishid: Math.floor(Math.random() * 1000) + 1 // Generate a random dish ID
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
      }));

      alert('Recipe added successfully!');
      // Reset form fields
      setFormType('');
      setRecipeName('');
      setRecipeDescription('');
      setIngredients('');
      setInstruction('');
      setRecipeLink('');
      setSelectedCategories([]);
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Error adding recipe. Please try again.');
    }
  };

  return (
    <div className="add-recipe-container" dir="rtl">
      <h1>אין כמו מתכון חדש וטעים!</h1>
      {formType === '' && (
        <div className="form-selection">
          <p>איך תרצו להוסיף את המתכון?</p>
          <button onClick={() => handleFormSelection('manual')}>כתיבה ידנית</button>
          <button onClick={() => handleFormSelection('link')}>הוספת קישור</button>
        </div>
      )}
      {(formType === 'manual' || formType === 'link') && (
        <form onSubmit={handleSubmit}>
          {formType === 'manual' && (
            <>
              <label htmlFor="recipe-name">שם המתכון:</label>
              <input
                type="text"
                id="recipe-name"
                placeholder="הזן שם המתכון"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
              />
              <label htmlFor="recipe-description">תיאור המתכון:</label>
              <textarea
                id="recipe-description"
                placeholder="הזן תיאור למתכון"
                value={recipeDescription}
                onChange={(e) => setRecipeDescription(e.target.value)}
              />
              <label htmlFor="ingredients">מצרכים:</label>
              <textarea
                id="ingredients"
                placeholder="הזן את המצרכים"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
              <label htmlFor="instruction">הוראות הכנה:</label>
              <textarea
                id="instruction"
                placeholder="הזן את הוראות ההכנה"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
              />
            </>
          )}
          {formType === 'link' && (
            <>
              <label htmlFor="recipe-link">קישור למתכון:</label>
              <input
                type="url"
                id="recipe-link"
                placeholder="הזן את הקישור"
                value={recipeLink}
                onChange={(e) => setRecipeLink(e.target.value)}
              />
              <label htmlFor="recipe-name">שם המתכון:</label>
              <input
                type="text"
                id="recipe-name"
                placeholder="הזן שם המתכון"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
              />
              <label htmlFor="recipe-description">תיאור המתכון:</label>
              <textarea
                id="recipe-description"
                placeholder="הזן תיאור למתכון"
                value={recipeDescription}
                onChange={(e) => setRecipeDescription(e.target.value)}
              />
            </>
          )}
          <fieldset className="category-selection">
            <legend>בחר קטגוריות:</legend>
            {categories.length > 0 ? (
              <div className="category-grid">
                {categories.map((category) => (
                  <div key={category.id} className="category-item">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      value={category.id}
                      onChange={handleCategoryChange}
                    />
                    <label htmlFor={`category-${category.id}`}>{category.name}</label>
                  </div>
                ))}
              </div>
            ) : (
              <p>טוען קטגוריות...</p>
            )}
          </fieldset>
          <button type="submit">הוספת מתכון</button>
        </form>
      )}
    </div>
  );
};
