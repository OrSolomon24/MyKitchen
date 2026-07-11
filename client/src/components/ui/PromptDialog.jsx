import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';

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
      <form onSubmit={handleSubmit}>
        {title && <h3 className="text-lg font-bold text-text mb-2">{title}</h3>}
        <Input
          type="text"
          autoFocus
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mb-5"
        />
        <div className="flex justify-end gap-3">
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
