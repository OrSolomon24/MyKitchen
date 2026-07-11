// components/addRecipe/FormSelection.js
import React from 'react';
import { Button } from '../ui/Button';

export const FormSelection = ({ handleFormSelection }) => (
  <div className="flex w-full max-w-[320px] flex-col items-stretch gap-3">
    <p className="mb-2 text-center text-md text-text">איך תרצו להוסיף את המתכון?</p>
    <Button variant="secondary" onClick={() => handleFormSelection('manual')}>כתיבה ידנית</Button>
    <Button variant="secondary" onClick={() => handleFormSelection('link')}>הוספת קישור (ללא AI)</Button>
    <Button variant="primary" onClick={() => handleFormSelection('agent')}>ייבוא אוטומטי מקישור (AI)</Button>
  </div>
);
