export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar acción',
  message = '¿Está seguro que desea continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700 text-white',
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          
          {/* Body */}
          <div className="px-4 sm:px-6 py-4">
            <p className="text-sm sm:text-base text-gray-600">
              {message}
            </p>
          </div>
          
          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
            {/* Mobile: Stack buttons vertically */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 transition-colors duration-200 ${confirmButtonClass}`}
              >
                {loading ? 'Procesando...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}