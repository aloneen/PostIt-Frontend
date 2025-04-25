import React from 'react'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#root')  // accessibility

export default function ConfirmationModal({
  isOpen,
  title = 'Are you sure?',
  message = '',
  onCancel,
  onConfirm
}) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onCancel}
      style={{
        content: {
          maxWidth: '400px',
          margin: 'auto',
          padding: '20px'
        }
      }}
    >
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:20 }}>
        <button onClick={onCancel} className="btn">Cancel</button>
        <button onClick={onConfirm} className="btn btn-danger">Delete</button>
      </div>
    </ReactModal>
  )
}
