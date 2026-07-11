import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import './ConfirmDialog.css';

export const PromptDialog = ({
  title,
  placeholder,
  confirmLabel = 'הוספה',
  cancelLabel = 'ביטול',
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onConfirm(value.trim());
  };

  return (
    <Modal onClose={onCancel}>
      <form className="confirm-dialog" onSubmit={handleSubmit}>
        {title && <h3>{title}</h3>}
        <input
          type="text"
          autoFocus
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="prompt-dialog-input"
        />
        <div className="confirm-dialog-actions">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant="primary">
            {confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
