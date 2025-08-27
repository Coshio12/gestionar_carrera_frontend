import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Clock, User } from 'lucide-react';

const DeleteConfirmModal = ({ tiempo, onConfirm, onClose }) => {
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const formatTime = (timeMs) => {
    if (!timeMs || timeMs < 0) return '00:00.00';
    
    const hours = Math.floor(timeMs / 3600000);
    const minutes = Math.floor((timeMs % 3600000) / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const centiseconds = Math.floor((timeMs % 1000) / 10);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setDeleting(false);
    }
  };

  const isConfirmValid = confirmText.toLowerCase() === 'eliminar';

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1 mr-4">
            <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
              <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
                Eliminar Tiempo
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Advertencia */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-red-800 mb-1 text-sm sm:text-base">¡Atención!</h3>
                <p className="text-red-700 text-xs sm:text-sm leading-relaxed">
                  Está a punto de eliminar este tiempo registrado. Esta acción es permanente y 
                  afectará las posiciones y estadísticas de la competencia.
                </p>
              </div>
            </div>
          </div>

          {/* Información del tiempo a eliminar */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Información del tiempo a eliminar:
            </h3>
            
            <div className="space-y-3">
              {/* Participante */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <User className="h-4 w-4 text-gray-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Participante:</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0 sm:ml-0 ml-6">
                  <span className="font-medium text-sm truncate">
                    {tiempo?.participantes?.nombre} {tiempo?.participantes?.apellidos}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold flex-shrink-0">
                    #{tiempo?.participantes?.dorsal}
                  </span>
                </div>
              </div>

              {/* Etapa */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-xs sm:text-sm text-gray-600">Etapa:</span>
                </div>
                <span className="font-medium text-sm sm:ml-0 ml-6">
                  Etapa {tiempo?.etapas?.numero_etapa}: {tiempo?.etapas?.nombre}
                </span>
              </div>

              {/* Tiempo y posición */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-gray-200">
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">Tiempo:</span>
                  <p className="font-mono font-bold text-base sm:text-lg text-gray-800">
                    {formatTime(tiempo?.tiempo_final)}
                  </p>
                  {tiempo?.penalizacion > 0 && (
                    <p className="text-xs text-red-600">
                      +{formatTime(tiempo.penalizacion)} penalización
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-gray-600">Posición:</span>
                  <p className="font-bold text-base sm:text-lg text-gray-800">
                    #{tiempo?.posicion}
                  </p>
                </div>
              </div>

              {/* Observaciones si existen */}
              {tiempo?.observaciones && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Observaciones:</span>
                  <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">
                    {tiempo.observaciones}
                  </p>
                </div>
              )}

              {/* Fecha de registro */}
              <div className="pt-2 border-t border-gray-200">
                <span className="text-xs sm:text-sm text-gray-600">Registrado el:</span>
                <p className="text-xs sm:text-sm text-gray-800">
                  {tiempo?.created_at ? new Date(tiempo.created_at).toLocaleString() : 'Fecha no disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm order-1 sm:order-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleting ? 'Eliminando...' : 'Eliminar Tiempo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;