import React from 'react';
import ReactModal from 'react-modal';
import './css/ConfirmationModal.css';

ReactModal.setAppElement('#root');

export default function ConfirmationModal({
  isOpen,
  title   = 'Are you sure?',
  message = '',
  onCancel,
  onConfirm
}) {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={onCancel} shouldCloseOnOverlayClick={true} overlayClassName="confirmation-modal__overlay" className="confirmation-modal__content" contentLabel={title}>

      <h3 className="confirmation-modal__title">{title}</h3>

      {message && (
        <p className="confirmation-modal__message">{message}</p>
      )}

      <div className="confirmation-modal__footer">
        <button className="confirmation-modal__btn confirmation-modal__btn--cancel" onClick={onCancel} >
          Cancel
        </button>
        <button className="confirmation-modal__btn confirmation-modal__btn--confirm" onClick={onConfirm}>
          Confirm
        </button>
      </div>
      
    </ReactModal>
  );
}
