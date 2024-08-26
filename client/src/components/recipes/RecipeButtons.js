// components/RecipeButtons.js
import React from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

export const RecipeButtons = ({ isEditing, handleSave, setIsEditing, handleDelete }) => (
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
);
