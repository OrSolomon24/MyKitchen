// pages/Recipe.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { RecipeField } from '../components/recipes/RecipeField';
import { RecipeButtons } from '../components/recipes/RecipeButtons';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  updateDish,
  deleteDish,
  checkIfProxyIsNeeded,
  fetchDishById,
  uploadDishImage,
  deleteDishImage,
} from '../api/dishes';
import { supabase } from '../api/supabaseClient';
import '../style/Recipe.css';

export const Recipe = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [dish, setDish] = useState(state?.dish || null);
  const [isEditing, setIsEditing] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [pendingDeleteRecipe, setPendingDeleteRecipe] = useState(false);
  const [pendingDeleteImageId, setPendingDeleteImageId] = useState(null);

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
      if (dish?.sourceUrl) {
        const proxyNeeded = await checkIfProxyIsNeeded(dish.sourceUrl);
        setUseProxy(proxyNeeded);
      }
    };

    checkProxy();
  }, [dish?.sourceUrl]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthToken(data.session?.access_token || '');
    });
  }, []);

  const handleSave = async () => {
    try {
      const updatedDish = dish.sourceUrl
        ? { ...dish, ingredients: undefined, steps: undefined }
        : dish;

      const response = await updateDish(updatedDish);
      setDish(response);
      setIsEditing(false);
      toast.success('המתכון עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating dish:', error);
      toast.error('שגיאה בעדכון המתכון');
    }
  };

  const handleImageUpload = async (event) => {
    if (!dish?.id) return;
    const files = Array.from(event.target.files || []);

    try {
      let updatedDish = dish;
      for (const file of files) {
        updatedDish = await uploadDishImage(dish.id, file);
      }
      setDish(updatedDish);
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('שגיאה בהעלאת תמונה');
    }
  };

  const confirmImageDelete = async () => {
    const imageId = pendingDeleteImageId;
    setPendingDeleteImageId(null);
    if (!dish?.id) return;

    try {
      const updatedDish = await deleteDishImage(dish.id, imageId);
      setDish(updatedDish);
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('שגיאה במחיקת תמונה');
    }
  };

  const handleChange = (field, value) => {
    setDish((prev) => ({
      ...prev,
      [field]:
        field === 'ingredients' || field === 'steps'
          ? value.split('\n').map((line) => line.trim()).filter((line) => line !== '')
          : value,
    }));
  };

  const confirmDeleteRecipe = async () => {
    setPendingDeleteRecipe(false);
    try {
      await deleteDish(dish.id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('שגיאה במחיקת המתכון');
    }
  };

  if (!dish?.id) {
    return <p>לא נבחר מתכון.</p>;
  }

  return (
    <div className="recipe-container">
      <h1 className="recipe-title">{dish.name}</h1>

      {isEditing ? (
        <div className="edit-view">
          <RecipeForm dish={dish} handleChange={handleChange} />

          {/* 🔹 images + upload WHILE editing */}
          {dish.images?.length > 0 && (
            <div className="recipe-images">
              {dish.images.map((img) => (
                <div key={img.id} className="recipe-image-wrapper">
                  <img src={img.url} alt={dish.name} />
                  <button
                    type="button"
                    className="delete-image-btn"
                    onClick={() => setPendingDeleteImageId(img.id)}
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
      ) : dish.sourceUrl ? (
        <div className="iframe-container">
          <RecipeField label={dish.name} field="description" dish={dish} />
          <iframe
            src={
              useProxy
                ? `${import.meta.env.VITE_API_URL}/proxy?url=${encodeURIComponent(dish.sourceUrl)}&token=${encodeURIComponent(authToken)}`
                : dish.sourceUrl
            }
            title={dish.name}
            allowFullScreen
          />
          {/* read-only images when viewing URL recipe */}
          {dish.images?.length > 0 && (
            <div className="recipe-images">
              {dish.images.map((img) => (
                <div key={img.id} className="recipe-image-wrapper">
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
          <RecipeField label="הוראות הכנה" field="steps" dish={dish} />

          {/* read-only images when viewing normal recipe */}
          {dish.images?.length > 0 && (
            <div className="recipe-images">
              {dish.images.map((img) => (
                <div key={img.id} className="recipe-image-wrapper">
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
        handleDelete={() => setPendingDeleteRecipe(true)}
      />

      {pendingDeleteRecipe && (
        <ConfirmDialog
          title="מחיקת מתכון"
          message="האם אתה בטוח שברצונך למחוק את המתכון?"
          danger
          onConfirm={confirmDeleteRecipe}
          onCancel={() => setPendingDeleteRecipe(false)}
        />
      )}

      {pendingDeleteImageId && (
        <ConfirmDialog
          title="מחיקת תמונה"
          message="למחוק את התמונה?"
          danger
          onConfirm={confirmImageDelete}
          onCancel={() => setPendingDeleteImageId(null)}
        />
      )}
    </div>
  );
};
