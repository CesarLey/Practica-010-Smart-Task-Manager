import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import './Toast.css'

let toastId = 0

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = toastId++
    const toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return { toasts, addToast, removeToast }
}

const Toast = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />
  }

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onClose(toast.id), 300)
  }

  return (
    <div className={`toast toast-${toast.type} ${isExiting ? 'toast-exit' : ''}`}>
      <div className="toast-icon">
        {icons[toast.type] || icons.info}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button 
        className="toast-close" 
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
