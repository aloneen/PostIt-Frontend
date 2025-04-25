// import React from 'react'
// import ReactModal from 'react-modal'

// ReactModal.setAppElement('#root')  // accessibility

// export default function ConfirmationModal({
//   isOpen,
//   title = 'Are you sure?',
//   message = '',
//   onCancel,
//   onConfirm
// }) {
//   return (
//     <ReactModal
//       isOpen={isOpen}
//       onRequestClose={onCancel}
//       style={{
//         content: {
//           maxWidth: '400px',
//           margin: 'auto',
//           padding: '20px'
//         }
//       }}
//     >
//       <h3>{title}</h3>
//       {message && <p>{message}</p>}
//       <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:20 }}>
//         <button onClick={onCancel} className="btn">Cancel</button>
//         <button onClick={onConfirm} className="btn btn-danger">Confirm</button>
//       </div>
//     </ReactModal>
//   )
// }


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
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        },
        content: {
          position: 'relative',
          inset: 'auto',
          padding: '24px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: '16px',
          fontSize: '1.5rem',
          color: '#2a2a2a'
        }}
      >
        {title}
      </h3>
      {message && (
        <p style={{ margin: 0, marginBottom: '24px', color: '#555', lineHeight: 1.4 }}>
          {message}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            fontSize: '1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#e0e0e0',
            color: '#333',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d5d5d5')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: '8px 16px',
            fontSize: '1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#ff6f61',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e55b4d')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff6f61')}
        >
          Confirm
        </button>
      </div>
    </ReactModal>
  )
}
