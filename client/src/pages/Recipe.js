import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { RecipeField } from '../components/recipes/RecipeField';
import { RecipeButtons } from '../components/recipes/RecipeButtons';
import { updateDish, deleteDish, checkIfProxyIsNeeded } from '../utils/dishUtils';
import '../style/Recipe.css';

export const Recipe = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [dish, setDish] = useState(state?.dish || { ingredients: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [useProxy, setUseProxy] = useState(false);

  useEffect(() => {
    const checkProxy = async () => {
      if (dish.url) {
        const proxyNeeded = await checkIfProxyIsNeeded(dish.url);
        setUseProxy(proxyNeeded);
      }
    };

    checkProxy();
  }, [dish.url]);

  const handleSave = async () => {
    try {
      const updatedDish = dish.url
        ? { ...dish, ingredients: undefined, instruction: undefined }
        : dish;
  
      const response = await updateDish(updatedDish);
      setDish(response);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating dish:', error);
    }
  };
  

  const handleChange = (field, value) => {
    setDish((prev) => ({
      ...prev,
      [field]: field === 'ingredients' ? value.split('\n') : value,
    }));
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirmDelete) return;

    try {
      await deleteDish(dish._id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  return (
    <div className="recipe-container" dir="rtl">
      {!dish._id ? (
        <p>לא נבחר מתכון.</p>
      ) : (
        <>
          {isEditing ? (
            <div className="edit-view">
              <RecipeForm dish={dish} handleChange={handleChange} />
            </div>
          ) : dish.url ? (
            <div className="iframe-container">
              <RecipeField label={dish.name} field="description" dish={dish} />
              <iframe
                src={useProxy ? `${process.env.REACT_APP_API_URL}/proxy?url=${encodeURIComponent(dish.url)}` : dish.url}
                title={dish.name}
                allowFullScreen
              />
            </div>
          ) : (
            <div className="recipe-details">
              <RecipeField label={dish.name} field="description" dish={dish} />
              <RecipeField label="מרכיבים" field="ingredients" dish={dish} />
              <RecipeField label="הוראות הכנה" field="instruction" dish={dish} />
            </div>
          )}
          <RecipeButtons
            isEditing={isEditing}
            handleSave={handleSave}
            setIsEditing={setIsEditing}
            handleDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};
