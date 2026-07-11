// pages/Recipe.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowRight } from 'react-icons/fa';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { RecipeField } from '../components/recipes/RecipeField';
import { RecipeButtons } from '../components/recipes/RecipeButtons';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FileInputButton } from '../components/ui/FileInputButton';
import { checkIfProxyIsNeeded } from '../api/dishes';
import {
  useDish,
  useUpdateDishMutation,
  useDeleteDishMutation,
  useUploadDishImageMutation,
  useDeleteDishImageMutation,
} from '../api/useDishesQueries';
import { supabase } from '../api/supabaseClient';

export const Recipe = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: queriedDish } = useDish(id, { placeholderData: state?.dish });
  const updateDishMutation = useUpdateDishMutation();
  const deleteDishMutation = useDeleteDishMutation();
  const uploadDishImageMutation = useUploadDishImageMutation();
  const deleteDishImageMutation = useDeleteDishImageMutation();

  const [dish, setDish] = useState(state?.dish || null);
  const [isEditing, setIsEditing] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [pendingDeleteRecipe, setPendingDeleteRecipe] = useState(false);
  const [pendingDeleteImageId, setPendingDeleteImageId] = useState(null);

  // Keep the local editable copy in sync with the query's cache -- the
  // placeholder from navigation state is list-shaped (no ingredients/steps),
  // so the real detail fetch that follows always needs to flow through here.
  useEffect(() => {
    if (queriedDish) setDish(queriedDish);
  }, [queriedDish]);

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

      const response = await updateDishMutation.mutateAsync(updatedDish);
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
      const results = await Promise.all(
        files.map((file) => uploadDishImageMutation.mutateAsync({ dishId: dish.id, file }))
      );
      if (results.length > 0) setDish(results[results.length - 1]);
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
      const updatedDish = await deleteDishImageMutation.mutateAsync({ dishId: dish.id, imageId });
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

  const backDestination = state?.categoryId
    ? `/foodCategories?category=${state.categoryId}`
    : '/foodCategories';

  const confirmDeleteRecipe = async () => {
    setPendingDeleteRecipe(false);
    try {
      await deleteDishMutation.mutateAsync(dish.id);
      navigate(backDestination);
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('שגיאה במחיקת המתכון');
    }
  };

  if (!dish?.id) {
    return <p className="p-6 text-center text-text-muted">לא נבחר מתכון.</p>;
  }

  return (
    <div className="mx-auto max-w-[900px] px-5 pb-16 pt-6 md:pb-20">
      <button
        type="button"
        onClick={() => navigate(backDestination)}
        className="mb-4 flex items-center gap-2 font-semibold text-text-muted transition-colors hover:text-primary"
      >
        <FaArrowRight />
        {state?.categoryName ? `חזרה ל${state.categoryName}` : 'חזרה לכל המתכונים'}
      </button>
      <h1 className="mb-5 text-center text-xl font-bold text-primary">{dish.name}</h1>

      {isEditing ? (
        <div className="flex flex-col gap-4">
          <RecipeForm dish={dish} handleChange={handleChange} />

          {/* 🔹 images + upload WHILE editing */}
          {dish.images?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {dish.images.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url}
                    alt={dish.name}
                    className="aspect-square w-[140px] max-w-full rounded-md object-cover shadow-sm sm:w-[180px]"
                  />
                  <button
                    type="button"
                    className="absolute bottom-2 end-2 flex min-h-9 items-center gap-1 rounded-sm bg-danger/90 px-3 py-2 text-sm text-text-on-dark transition-colors duration-150 hover:bg-danger-dark"
                    onClick={() => setPendingDeleteImageId(img.id)}
                  >
                    🗑️ מחיקת תמונה
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="mb-2 flex items-center gap-2 font-semibold text-text">
              הוספת תמונות
              <span className="text-md">📸</span>
            </label>

            <FileInputButton accept="image/*" multiple onChange={handleImageUpload} className="w-full">
              בחירת תמונות
            </FileInputButton>
          </div>

        </div>
      ) : dish.sourceUrl ? (
        <div className="flex flex-col gap-4">
          <RecipeField label={dish.name} field="description" dish={dish} />
          <div className="h-[80vh] w-full overflow-hidden rounded-lg shadow-md">
            <iframe
              src={
                useProxy
                  ? `${import.meta.env.VITE_API_URL}/proxy?url=${encodeURIComponent(dish.sourceUrl)}&token=${encodeURIComponent(authToken)}`
                  : dish.sourceUrl
              }
              title={dish.name}
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
          {/* read-only images when viewing URL recipe */}
          {dish.images?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {dish.images.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url}
                    alt={dish.name}
                    loading="lazy"
                    className="aspect-square w-[140px] max-w-full rounded-md object-cover shadow-sm sm:w-[180px]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <RecipeField label={dish.name} field="description" dish={dish} />
          <RecipeField label="מרכיבים" field="ingredients" dish={dish} />
          <RecipeField label="הוראות הכנה" field="steps" dish={dish} />

          {/* read-only images when viewing normal recipe */}
          {dish.images?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {dish.images.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url}
                    alt={dish.name}
                    loading="lazy"
                    className="aspect-square w-[140px] max-w-full rounded-md object-cover shadow-sm sm:w-[180px]"
                  />
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
