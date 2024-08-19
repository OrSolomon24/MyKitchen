import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../style/Recipe.css';
import { FaPencilAlt } from 'react-icons/fa';

export const Recipe = () => {
  const { state } = useLocation();
  const [dish, setDish] = useState(state?.dish || { ingredients: [] });
  const [isEditing, setIsEditing] = useState(false);

  if (!dish._id) return <p dir="rtl">לא נבחר מתכון.</p>;

  const handleSave = async () => {
    try {
      console.log('Saving dish:', dish); // Debugging line
      const response = await fetch(`http://localhost:5000/api/food/dish/${dish._id}`, {
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
    console.log(`Updating ${field} with value:`, value); // Debugging line
    setDish(prev => ({ 
      ...prev, 
      [field]: field === 'ingredients' ? value.split('\n') : value 
    }));
  };

  const renderField = (label, field, type = 'text') => (
    <section className="recipe-section">
      <h2>{label}</h2>
      {isEditing ? (
        type === 'textarea' ? (
          <textarea
            value={field === 'ingredients' ? dish[field].join('\n') : dish[field]}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        ) : (
          <input
            type="text"
            value={dish[field]}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        )
      ) : field === 'ingredients' ? (
        <ul className="ingredients-list">
          {dish[field].map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      ) : (
        <p>{dish[field]}</p>
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
      <button 
        onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
        className={isEditing ? "save-button" : "edit-button"}
      >
        {isEditing ? 'שמור שינויים' : <><FaPencilAlt /> ערוך מתכון</>}
      </button>
      {dish.url ? (
        <div className="iframe-container">
          <iframe src={dish.url} title={dish.name} allowFullScreen />
        </div>
      ) : (
        <div className="recipe-details">
          {renderField('תיאור', 'description', 'textarea')}
          {renderField('מרכיבים', 'ingredients', 'textarea')}
          {renderField('הוראות הכנה', 'instraction', 'textarea')} {/* Ensure field name is correct */}
        </div>
      )}
    </div>
  );
};
