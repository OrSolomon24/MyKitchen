import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({
  title,
  message,
  confirmLabel = 'אישור',
  cancelLabel = 'ביטול',
  danger = false,
  onConfirm,
  onCancel,
}) => (
  <Modal onClose={onCancel}>
    <div>
      {title && <h3 className="text-lg font-bold text-text mb-2">{title}</h3>}
      <p className="text-text-muted mb-5">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);
