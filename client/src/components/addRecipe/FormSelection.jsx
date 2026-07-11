// components/addRecipe/FormSelection.js
import React from 'react';
import { Button } from '../ui/Button';

export const FormSelection = ({ handleFormSelection }) => (
  <div className="form-selection">
    <p>איך תרצו להוסיף את המתכון?</p>
    <Button variant="secondary" onClick={() => handleFormSelection('manual')}>כתיבה ידנית</Button>
    <Button variant="secondary" onClick={() => handleFormSelection('link')}>הוספת קישור (ללא AI)</Button>
    <Button variant="primary" onClick={() => handleFormSelection('agent')}>ייבוא אוטומטי מקישור (AI)</Button>
  </div>
);
