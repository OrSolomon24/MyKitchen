import React from 'react';
import { useLocation } from 'react-router-dom';
import '../style/Recipe.css';

export const Recipe = () => {
  const { state } = useLocation();
  const { dish } = state || {};

  if (!dish) {
    return <p dir="rtl">לא נבחר מתכון.</p>;
  }

  return (
    <div className="recipe-container" dir="rtl">
      <h1 className="recipe-title">{dish.name}</h1>

      {dish.url ? (
        <div className="iframe-container">
          <iframe 
            src={dish.url} 
            title={dish.name} 
            frameBorder="0" 
            allowFullScreen 
          />
        </div>
      ) : (
        <div className="recipe-details">
          <section className="recipe-section">
            <h2>תיאור</h2>
            <p>{dish.description}</p>
          </section>
          <section className="recipe-section">
            <h2>מרכיבים</h2>
            <ul className="ingredients-list">
              {dish.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </section>
          <section className="recipe-section">
            <h2>הוראות הכנה</h2>
            <p>{dish.instraction}</p>
          </section>
        </div>
      )}
    </div>
  );
};