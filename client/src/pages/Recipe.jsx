import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaArrowRight,
  FaPrint,
  FaShareAlt,
  FaRegClock,
  FaUserFriends,
  FaFire,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { RecipeForm } from '../components/recipes/RecipeForm';
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

/* Check-off ingredient list for cooking; ticks are session-only on purpose */
const IngredientsChecklist = ({ items = [] }) => {
  const [checked, setChecked] = useState(() => new Set());

  const toggle = (index) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
      {items.map((item, index) => (
        <li key={index}>
          <label className="flex cursor-pointer items-start gap-3 rounded-sm px-2 py-2 transition-colors hover:bg-surface-muted">
            <input
              type="checkbox"
              checked={checked.has(index)}
              onChange={() => toggle(index)}
              className="mt-1.5 h-4 w-4 shrink-0 cursor-pointer accent-primary print:hidden"
            />
            <span
              className={`leading-relaxed transition-colors ${
                checked.has(index) ? 'text-text-muted line-through' : 'text-text'
              }`}
            >
              {item}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
};

const StepsList = ({ items = [] }) => (
  <ol className="m-0 flex list-none flex-col gap-5 p-0">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-tint font-display text-md font-bold text-accent-dark">
          {index + 1}
        </span>
        <p className="m-0 pt-1.5 leading-relaxed text-text">{item}</p>
      </li>
    ))}
  </ol>
);

const MetaChip = ({ icon: Icon, label, value }) => (
  <span className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm text-text shadow-sm">
    <Icon aria-hidden="true" className="text-accent" />
    <span className="text-text-muted">{label}</span>
    <span className="font-semibold">{value}</span>
  </span>
);

const ImageGallery = ({ images, name, onDelete }) => (
  <div className="flex flex-wrap gap-4">
    {images.map((img) => (
      <div key={img.id} className="relative">
        <img
          src={img.url}
          alt={name}
          loading="lazy"
          className="aspect-square w-[140px] max-w-full rounded-md object-cover shadow-sm sm:w-[180px]"
        />
        {onDelete && (
          <button
            type="button"
            className="absolute bottom-2 end-2 flex min-h-9 items-center gap-1 rounded-sm bg-danger/90 px-3 py-2 text-sm text-text-on-dark transition-colors duration-150 hover:bg-danger-dark"
            onClick={() => onDelete(img.id)}
          >
            🗑️ מחיקת תמונה
          </button>
        )}
      </div>
    ))}
  </div>
);

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

  const isLinkOnly = Boolean(dish?.sourceUrl) && !dish?.ingredients?.length && !dish?.steps?.length;

  useEffect(() => {
    const checkProxy = async () => {
      if (isLinkOnly) {
        const proxyNeeded = await checkIfProxyIsNeeded(dish.sourceUrl);
        setUseProxy(proxyNeeded);
      }
    };

    checkProxy();
  }, [isLinkOnly, dish?.sourceUrl]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthToken(data.session?.access_token || '');
    });
  }, []);

  const cleanLines = (lines) =>
    (lines || []).map((line) => line.trim()).filter((line) => line !== '');

  const handleSave = async () => {
    try {
      const updatedDish = isLinkOnly
        ? { ...dish, ingredients: undefined, steps: undefined }
        : { ...dish, ingredients: cleanLines(dish.ingredients), steps: cleanLines(dish.steps) };

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
      // Keep the raw split lines (including blanks) while typing so the
      // textarea round-trips exactly what the user entered -- trimming/
      // filtering here would strip a just-pressed Enter before the user
      // could type on the new row, making it look like Enter did nothing.
      // Blank/whitespace-only lines get cleaned up on save instead.
      [field]:
        field === 'ingredients' || field === 'steps'
          ? value.split('\n')
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

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: dish.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('הקישור הועתק');
      }
    } catch {
      // user dismissed the share sheet
    }
  };

  if (!dish?.id) {
    return <p className="p-6 text-center text-text-muted">לא נבחר מתכון.</p>;
  }

  const heroImage = dish.images?.[0];
  const galleryImages = dish.images?.slice(1) || [];

  return (
    <div className="mx-auto max-w-[1000px] px-5 pb-16 pt-6 md:pb-20">
      <button
        type="button"
        onClick={() => navigate(backDestination)}
        className="mb-5 flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-primary print:hidden"
      >
        <FaArrowRight aria-hidden="true" />
        {state?.categoryName ? `חזרה ל${state.categoryName}` : 'חזרה לכל המתכונים'}
      </button>

      {/* Recipe header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            {state?.categoryName && (
              <p className="m-0 mb-2 text-sm font-semibold tracking-wide text-accent">
                {state.categoryName}
              </p>
            )}
            <h1 className="m-0 font-display text-[clamp(1.75rem,4vw,2.6rem)] font-black leading-tight text-ink">
              {dish.name}
            </h1>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              aria-label="הדפסת המתכון"
              title="הדפסה"
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-border bg-surface text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <FaPrint />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="שיתוף המתכון"
              title="שיתוף"
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-border bg-surface text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <FaShareAlt />
            </button>
          </div>
        </div>

        {dish.description && (
          <p className="m-0 mt-3 max-w-[65ch] text-md leading-relaxed text-text-muted">
            {dish.description}
          </p>
        )}

        {/* Meta chips render only for fields the dish actually has */}
        <div className="mt-4 flex flex-wrap items-center gap-2 empty:hidden">
          {dish.prepTime && <MetaChip icon={FaRegClock} label="זמן הכנה" value={dish.prepTime} />}
          {dish.cookTime && <MetaChip icon={FaRegClock} label="זמן בישול" value={dish.cookTime} />}
          {dish.servings && <MetaChip icon={FaUserFriends} label="מנות" value={dish.servings} />}
          {dish.difficulty && <MetaChip icon={FaFire} label="רמת קושי" value={dish.difficulty} />}
          {dish.sourceUrl && !isLinkOnly && (
            <a
              href={dish.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm font-semibold text-primary shadow-sm transition-colors hover:text-primary-dark"
            >
              <FaExternalLinkAlt aria-hidden="true" className="text-xs" />
              למתכון המקורי
            </a>
          )}
        </div>
      </header>

      {isEditing ? (
        <div className="flex flex-col gap-4">
          <RecipeForm dish={dish} handleChange={handleChange} isLinkOnly={isLinkOnly} />

          {dish.images?.length > 0 && (
            <ImageGallery
              images={dish.images}
              name={dish.name}
              onDelete={(imageId) => setPendingDeleteImageId(imageId)}
            />
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
      ) : isLinkOnly ? (
        <div className="flex flex-col gap-5">
          <div className="h-[80vh] w-full overflow-hidden rounded-lg shadow-md print:hidden">
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
          <a
            href={dish.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 self-start font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            <FaExternalLinkAlt aria-hidden="true" className="text-xs" />
            לצפייה באתר המקורי
          </a>
          {dish.images?.length > 0 && <ImageGallery images={dish.images} name={dish.name} />}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Hero image slot — first uploaded photo; swap by re-uploading */}
          {heroImage && (
            <img
              src={heroImage.url}
              alt={dish.name}
              className="aspect-[16/9] w-full rounded-lg object-cover shadow-md md:aspect-[21/9]"
            />
          )}

          <div className="grid items-start gap-6 md:grid-cols-[320px_minmax(0,1fr)]">
            {dish.ingredients?.length > 0 && (
              <aside className="rounded-lg bg-surface p-5 shadow-sm md:sticky md:top-20 print:static">
                <h2 className="mb-3 border-b border-border pb-3 font-display text-lg font-bold text-ink">
                  מרכיבים
                </h2>
                <IngredientsChecklist items={dish.ingredients} />
              </aside>
            )}

            {dish.steps?.length > 0 && (
              <section className="rounded-lg bg-surface p-5 shadow-sm md:p-7">
                <h2 className="mb-5 border-b border-border pb-3 font-display text-lg font-bold text-ink">
                  הוראות הכנה
                </h2>
                <StepsList items={dish.steps} />
              </section>
            )}
          </div>

          {galleryImages.length > 0 && (
            <ImageGallery images={galleryImages} name={dish.name} />
          )}
        </div>
      )}

      <div className="print:hidden">
        <RecipeButtons
          isEditing={isEditing}
          handleSave={handleSave}
          setIsEditing={setIsEditing}
          handleDelete={() => setPendingDeleteRecipe(true)}
        />
      </div>

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
