// components/RecipeField.js
import React from 'react';

export const RecipeField = ({ label, field, dish }) => (
  <section className="rounded-md bg-surface p-5 shadow-sm">
    <h2 className="mb-3 text-md font-bold text-primary">{label}</h2>
    {field === 'ingredients' ? (
      <ul className="m-0 list-disc ps-5 text-text">
        {dish[field]?.map((item, index) => (
          <li key={index} className="mb-2 leading-relaxed">{item}</li>
        ))}
      </ul>
    ) : field === 'steps' ? (
      <ol className="m-0 list-decimal ps-5 text-text">
        {dish[field]?.map((item, index) => (
          <li key={index} className="mb-2 leading-relaxed">{item}</li>
        ))}
      </ol>
    ) : (
      <p className="m-0 text-text">{dish[field] || ''}</p>
    )}

    {/* Add the hyperlink inside the description container */}
    {field === 'description' && dish.sourceUrl && (
      <a
        href={dish.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block font-semibold text-accent"
      >
        <br />
        לחצי כאן לצפייה באתר המקורי
      </a>
    )}
  </section>
);
