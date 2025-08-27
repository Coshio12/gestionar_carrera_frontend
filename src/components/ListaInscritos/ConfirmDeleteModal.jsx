import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, participante, loading = false }) => {
  if (!isOpen) return null;

  const dorsalText = participante?.dorsal 
    ? participante.dorsal.toString().padStart(3, "0")
    : "Sin asignar";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-red-100 rounded-full flex-shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Confirmar eliminación
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 flex-shrink-0 p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            ¿Estás seguro de que deseas eliminar al participante?
          </p>
          
          {participante && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Nombre:</span>{' '}
                  <span className="text-gray-900">{participante.nombre} {participante.apellidos}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Dorsal:</span>{' '}
                  <span className={`${participante.dorsal ? 'text-gray-900' : 'text-orange-600'}`}>
                    {dorsalText}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">CI:</span>{' '}
                  <span className="text-gray-900 font-mono">{participante.ci}</span>
                </p>
                {participante.comunidad && (
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Comunidad:</span>{' '}
                    <span className="text-gray-900">{participante.comunidad}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-red-800">
              <span className="font-medium">Advertencia:</span> Esta acción no se puede deshacer. 
              El participante será eliminado permanentemente de la base de datos junto con todos sus archivos.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200">
          {/* Mobile: Stack buttons vertically */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading && (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{loading ? 'Eliminando...' : 'Eliminar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;