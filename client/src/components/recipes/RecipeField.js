// components/RecipeField.js
import React from 'react';

export const RecipeField = ({ label, field, dish }) => (
  <section className="recipe-section">
    <h2>{label}</h2>
    {field === 'ingredients' ? (
      <ul className="ingredients-list">
        {dish[field]?.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    ) : field === 'instruction' ? (
      <p dangerouslySetInnerHTML={{ __html: (dish[field] || '').replace(/\n/g, '<br/>') }} />
    ) : (
      <p>{dish[field] || ''}</p>
    )}

    {/* Add the hyperlink inside the description container */}
    {field === 'description' && dish.url && (
      <a
        href={dish.url}
        target="_blank"
        rel="noopener noreferrer"
        className="recipe-link"
      >
        <br />
        לחצי כאן לצפייה באתר המקורי
      </a>
    )}
  </section>
);
