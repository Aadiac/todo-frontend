import React from 'react'
import './ErrorPopup.css'

export const ErrorPopup = ({message,onClose}) => {

    if (!message ) return null;
  return (
    <div className="errpopup-overlay">
        <div className="popup">
            <h2>Error ❌</h2>
            <p>{message}</p>
            <button onClick={onClose}>Close</button>
        </div>
    </div>
  )
}
