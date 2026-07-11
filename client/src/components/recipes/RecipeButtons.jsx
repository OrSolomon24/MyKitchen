// components/RecipeButtons.js
import React from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Button } from '../ui/Button';

export const RecipeButtons = ({ isEditing, handleSave, setIsEditing, handleDelete }) => (
  <div className="buttons-container">
    <Button variant="primary" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
      {isEditing ? 'שמור שינויים' : <><FaPencilAlt /> ערוך מתכון</>}
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      <FaTrash /> מחק מתכון
    </Button>
  </div>
);
