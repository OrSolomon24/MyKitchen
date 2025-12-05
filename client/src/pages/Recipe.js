// pages/Recipe.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { RecipeField } from '../components/recipes/RecipeField';
import { RecipeButtons } from '../components/recipes/RecipeButtons';
import {
  updateDish,
  deleteDish,
  checkIfProxyIsNeeded,
  fetchDishById,
  uploadDishImage,
  deleteDishImage,
} from '../utils/dishUtils';
import '../style/Recipe.css';

export const Recipe = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [dish, setDish] = useState(state?.dish || null);
  const [isEditing, setIsEditing] = useState(false);
  const [useProxy, setUseProxy] = useState(false);

  useEffect(() => {
    const loadDish = async () => {
      if (!dish && id) {
        try {
          const data = await fetchDishById(id);
          setDish(data);
        } catch (error) {
          console.error('Error loading dish:', error);
        }
      }
    };

    loadDish();
  }, [dish, id]);

  useEffect(() => {
    const checkProxy = async () => {
      if (dish?.url) {
        const proxyNeeded = await checkIfProxyIsNeeded(dish.url);
        setUseProxy(proxyNeeded);
      }
    };

    checkProxy();
  }, [dish?.url]);

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

  const handleImageUpload = async (event) => {
    if (!dish?._id) return;
    const files = Array.from(event.target.files || []);

    try {
      let updatedDish = dish;
      for (const file of files) {
        updatedDish = await uploadDishImage(dish._id, file);
      }
      setDish(updatedDish);
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('שגיאה בהעלאת תמונה');
    }
  };

  const handleImageDelete = async (publicId) => {
    if (!dish?._id) return;
    const confirmDelete = window.confirm('למחוק את התמונה?');
    if (!confirmDelete) return;

    try {
      const updatedDish = await deleteDishImage(dish._id, publicId);
      setDish(updatedDish);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('שגיאה במחיקת תמונה');
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

  if (!dish?._id) {
    return <p>לא נבחר מתכון.</p>;
  }

  return (
    <div className="recipe-container" dir="rtl">
      {isEditing ? (
        <div className="edit-view">
          <RecipeForm dish={dish} handleChange={handleChange} />

          {/* 🔹 images + upload WHILE editing */}
          {dish.images?.length > 0 && (
            <div className="recipe-images">
              {dish.images.map((img) => (
                <div key={img.publicId} className="recipe-image-wrapper">
                  <img src={img.url} alt={dish.name} />
                  <button
                    type="button"
                    className="delete-image-btn"
                    onClick={() => handleImageDelete(img.publicId)}
                  >
                    🗑️ מחיקת תמונה
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="recipe-image-upload">
            <label className="upload-label">
              הוספת תמונות
              <span className="upload-icon">📸</span>
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              className="upload-input"
              onChange={handleImageUpload}
            />
          </div>

        </div>
      ) : dish.url ? (
        <div className="iframe-container">
          <RecipeField label={dish.name} field="description" dish={dish} />
          <iframe
            src={
              useProxy
                ? `${process.env.REACT_APP_API_URL}/proxy?url=${encodeURIComponent(dish.url)}`
                : dish.url
            }
            title={dish.name}
            allowFullScreen
          />
          {/* read-only images when viewing URL recipe */}
          {dish.images?.length > 0 && (
            <div className="recipe-images">
              {dish.images.map((img) => (
                <div key={img.publicId} className="recipe-image-wrapper">
                  <img src={img.url} alt={dish.name} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="recipe-details">
          <RecipeField label={dish.name} field="description" dish={dish} />
          <RecipeField label="מרכיבים" field="ingredients" dish={dish} />
          <RecipeField label="הוראות הכנה" field="instruction" dish={dish} />

          {/* read-only images when viewing normal recipe */}
          {dish.images?.length > 0 && (
            <div className="recipe-images">
              {dish.images.map((img) => (
                <div key={img.publicId} className="recipe-image-wrapper">
                  <img src={img.url} alt={dish.name} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <RecipeButtons
        isEditing={isEditing}
        handleSave={handleSave}
        setIsEditing={setIsEditing}
        handleDelete={handleDelete}
      />
    </div>
  );
};
