// components/addRecipe/FormSelection.js
import React from 'react';

export const FormSelection = ({ handleFormSelection }) => (
  <div className="form-selection">
    <p>איך תרצו להוסיף את המתכון?</p>
    <button onClick={() => handleFormSelection('manual')}>כתיבה ידנית</button>
    <button onClick={() => handleFormSelection('link')}>הוספת קישור</button>
  </div>
);
