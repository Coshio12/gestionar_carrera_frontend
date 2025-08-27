import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Convenience methods
  const showSuccess = (message) => addToast(message, 'success');
  const showError = (message) => addToast(message, 'error');
  const showWarning = (message) => addToast(message, 'warning');
  const showInfo = (message) => addToast(message, 'info');

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Componente para mostrar las notificaciones
const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  const getToastStyles = (type) => {
    const baseStyles = 'mb-4 p-4 rounded-lg shadow-lg flex items-center justify-between max-w-sm';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-100 border border-green-500 text-green-700`;
      case 'error':
        return `${baseStyles} bg-red-100 border border-red-500 text-red-700`;
      case 'warning':
        return `${baseStyles} bg-yellow-100 border border-yellow-500 text-yellow-700`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-100 border border-blue-500 text-blue-700`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${getToastStyles(toast.type)} animate-slide-in-right`}
          >
            <div className="flex items-center">
              <span className="mr-2 text-lg">{getIcon(toast.type)}</span>
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-lg hover:opacity-70 font-bold"
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};