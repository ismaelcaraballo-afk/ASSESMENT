import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const { duration = 4000, onUndo, undoLabel = 'Undo' } = typeof options === 'number' 
      ? { duration: options } 
      : options
    
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, onUndo, undoLabel }])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback((message, options) => addToast(message, 'success', options), [addToast])
  const error = useCallback((message, options) => addToast(message, 'error', options), [addToast])
  const info = useCallback((message, options) => addToast(message, 'info', options), [addToast])
  const warning = useCallback((message, options) => addToast(message, 'warning', options), [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onClose }) {
  const bgColors = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    warning: 'bg-yellow-500 dark:bg-yellow-600',
    info: 'bg-blue-500 dark:bg-blue-600'
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  const handleUndo = () => {
    if (toast.onUndo) {
      toast.onUndo()
    }
    onClose()
  }

  return (
    <div 
      className={`${bgColors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}
      role="alert"
      aria-live="polite"
    >
      <span className="text-lg font-bold" aria-hidden="true">{icons[toast.type]}</span>
      <span className="flex-1 text-sm">{toast.message}</span>
      {toast.onUndo && (
        <button 
          onClick={handleUndo}
          className="text-white font-semibold text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
          aria-label={toast.undoLabel}
        >
          {toast.undoLabel}
        </button>
      )}
      <button 
        onClick={onClose}
        className="text-white/80 hover:text-white text-lg font-bold"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
