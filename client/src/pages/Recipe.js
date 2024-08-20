// Recipe.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import '../style/Recipe.css';

const apiUrl = process.env.REACT_APP_API_URL;

export const Recipe = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [dish, setDish] = useState(state?.dish || { ingredients: [] });
  const [isEditing, setIsEditing] = useState(false);

  if (!dish._id) return <p dir="rtl">לא נבחר מתכון.</p>;

  const handleSave = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/food/dish/${dish._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish),
      });
      if (!response.ok) throw new Error('Failed to update dish');
      setDish(await response.json());
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
      const response = await fetch(`${apiUrl}/api/food/dish/${dish._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete dish');
      navigate('/');
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const renderField = (label, field, type = 'text') => (
    <section className="recipe-section">
      <h2>{label}</h2>
      {isEditing ? (
        type === 'textarea' ? (
          <textarea
            value={field === 'ingredients' ? dish[field]?.join('\n') : dish[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        ) : (
          <input
            type="text"
            value={dish[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        )
      ) : field === 'ingredients' ? (
        <ul className="ingredients-list">
          {dish[field]?.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      ) : field === 'instruction' ? (
        <p dangerouslySetInnerHTML={{ __html: (dish[field] || '').replace(/\n/g, '<br/>') }} />
      ) : (
        <p>{dish[field] || ''}</p>
      )}
    </section>
  );

  return (
    <div className="recipe-container" dir="rtl">
      <h1 className="recipe-title">
        {isEditing ? (
          <input
            value={dish.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="dish-name"
          />
        ) : (
          <span className="dish-name">{dish.name}</span>
        )}
      </h1>

      {dish.url ? (
        <div className="iframe-container">
          {renderField('תיאור', 'description', 'textarea')}
          <iframe src={dish.url} title={dish.name} allowFullScreen />
        </div>
      ) : (
        <div className="recipe-details">
          {renderField('תיאור', 'description', 'textarea')}
          {renderField('מרכיבים', 'ingredients', 'textarea')}
          {renderField('הוראות הכנה', 'instruction', 'textarea')}
        </div>
      )}

      <div className="buttons-container">
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={isEditing ? 'save-button' : 'edit-button'}
        >
          {isEditing ? 'שמור שינויים' : <><FaPencilAlt /> ערוך מתכון</>}
        </button>
        <button onClick={handleDelete} className="delete-button">
          <FaTrash /> מחק מתכון
        </button>
      </div>
    </div>
  );
};
