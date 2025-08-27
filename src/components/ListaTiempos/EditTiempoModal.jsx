import React, { useState, useEffect } from 'react';
import { X, Save, Clock, AlertTriangle, User } from 'lucide-react';
import ParticipantSearch from '../ParticipantSearch';

const EditTiempoModal = ({ tiempo, participantes, etapas, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    participante_id: '',
    etapa_id: '',
    tiempo: '',
    penalizacion: '',
    observaciones: ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tiempo) {
      setFormData({
        participante_id: tiempo.participante_id || '',
        etapa_id: tiempo.etapa_id || '',
        tiempo: formatTimeForInput(tiempo.tiempo),
        penalizacion: formatTimeForInput(tiempo.penalizacion || 0),
        observaciones: tiempo.observaciones || ''
      });
    }
  }, [tiempo]);

  const formatTimeForInput = (timeMs) => {
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

  const parseTimeString = (timeString) => {
    if (!timeString) return 0;
    
    const parts = timeString.split(':');
    let hours = 0, minutes = 0, seconds = 0, centiseconds = 0;
    
    if (parts.length === 3) {
      hours = parseInt(parts[0]) || 0;
      minutes = parseInt(parts[1]) || 0;
      const secondsParts = parts[2].split('.');
      seconds = parseInt(secondsParts[0]) || 0;
      centiseconds = parseInt(secondsParts[1]) || 0;
    } else if (parts.length === 2) {
      minutes = parseInt(parts[0]) || 0;
      const secondsParts = parts[1].split('.');
      seconds = parseInt(secondsParts[0]) || 0;
      centiseconds = parseInt(secondsParts[1]) || 0;
    }
    
    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + (centiseconds * 10);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.participante_id) {
      newErrors.participante_id = 'Debe seleccionar un participante';
    }

    if (!formData.etapa_id) {
      newErrors.etapa_id = 'Debe seleccionar una etapa';
    }

    if (!formData.tiempo) {
      newErrors.tiempo = 'El tiempo es requerido';
    } else {
      const tiempoMs = parseTimeString(formData.tiempo);
      if (tiempoMs <= 0) {
        newErrors.tiempo = 'El tiempo debe ser mayor a 0';
      }
    }

    if (formData.penalizacion) {
      const penalizacionMs = parseTimeString(formData.penalizacion);
      if (penalizacionMs < 0) {
        newErrors.penalizacion = 'La penalización no puede ser negativa';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      const tiempoData = {
        participante_id: formData.participante_id,
        etapa_id: parseInt(formData.etapa_id),
        tiempo: parseTimeString(formData.tiempo),
        penalizacion: parseTimeString(formData.penalizacion || '00:00.00'),
        observaciones: formData.observaciones || null
      };

      const result = await onSave(tiempoData);
      if (!result.success) {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Error inesperado al guardar' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const participanteSeleccionado = participantes.find(p => p.id === formData.participante_id);
  const etapaSeleccionada = etapas.find(e => e.id === parseInt(formData.etapa_id));

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1 mr-4">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Editar Tiempo</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Modificar información del tiempo registrado
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-xs sm:text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Información actual */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Información actual:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-600">Participante:</span>
                <p className="font-medium break-words">
                  {tiempo?.participantes?.nombre} {tiempo?.participantes?.apellidos}
                  <span className="text-blue-600 ml-2">#{tiempo?.participantes?.dorsal}</span>
                </p>
              </div>
              <div>
                <span className="text-gray-600">Etapa:</span>
                <p className="font-medium break-words">{tiempo?.etapas?.nombre}</p>
              </div>
              <div>
                <span className="text-gray-600">Tiempo original:</span>
                <p className="font-mono font-medium">{formatTimeForInput(tiempo?.tiempo)}</p>
              </div>
              <div>
                <span className="text-gray-600">Posición:</span>
                <p className="font-medium">#{tiempo?.posicion}</p>
              </div>
            </div>
          </div>

          {/* Grid de campos del formulario */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Selección de participante */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Participante *
              </label>
              <ParticipantSearch
                participantes={participantes}
                categorias={[]} // Las categorías vienen anidadas en participantes
                selectedParticipantId={formData.participante_id}
                onSelectParticipant={(participanteId) => handleInputChange('participante_id', participanteId)}
                placeholder="Buscar participante por nombre, dorsal o CI..."
              />
              {errors.participante_id && (
                <p className="text-red-500 text-xs mt-1">{errors.participante_id}</p>
              )}
            </div>

            {/* Selección de etapa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etapa *
              </label>
              <select
                value={formData.etapa_id}
                onChange={(e) => handleInputChange('etapa_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  errors.etapa_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar etapa...</option>
                {etapas.map(etapa => (
                  <option key={etapa.id} value={etapa.id}>
                    Etapa {etapa.numero_etapa}: {etapa.nombre}
                  </option>
                ))}
              </select>
              {errors.etapa_id && (
                <p className="text-red-500 text-xs mt-1">{errors.etapa_id}</p>
              )}
            </div>

            {/* Tiempo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Tiempo *
              </label>
              <input
                type="text"
                value={formData.tiempo}
                onChange={(e) => handleInputChange('tiempo', e.target.value)}
                placeholder="MM:SS.CC o HH:MM:SS.CC"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                  errors.tiempo ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: MM:SS.CC (ej: 15:30.45) o HH:MM:SS.CC (ej: 1:15:30.45)
              </p>
              {errors.tiempo && (
                <p className="text-red-500 text-xs mt-1">{errors.tiempo}</p>
              )}
            </div>

            {/* Penalización */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penalización
              </label>
              <input
                type="text"
                value={formData.penalizacion}
                onChange={(e) => handleInputChange('penalizacion', e.target.value)}
                placeholder="00:00.00"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                  errors.penalizacion ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Penalización adicional en formato MM:SS.CC (opcional)
              </p>
              {errors.penalizacion && (
                <p className="text-red-500 text-xs mt-1">{errors.penalizacion}</p>
              )}
            </div>

            {/* Observaciones */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales (opcional)..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
            </div>
          </div>

          {/* Vista previa de cambios */}
          {(formData.participante_id && formData.etapa_id && formData.tiempo) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-3">Vista previa de cambios:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-blue-600">Participante:</span>
                  <p className="font-medium break-words">
                    {participanteSeleccionado?.nombre} {participanteSeleccionado?.apellidos}
                    <span className="text-blue-600 ml-2">#{participanteSeleccionado?.dorsal}</span>
                  </p>
                </div>
                <div>
                  <span className="text-blue-600">Etapa:</span>
                  <p className="font-medium break-words">{etapaSeleccionada?.nombre}</p>
                </div>
                <div>
                  <span className="text-blue-600">Nuevo tiempo:</span>
                  <p className="font-mono font-medium">{formData.tiempo}</p>
                </div>
                <div>
                  <span className="text-blue-600">Penalización:</span>
                  <p className="font-mono font-medium">
                    {formData.penalizacion || '00:00.00'}
                  </p>
                </div>
              </div>
              {formData.observaciones && (
                <div className="mt-3">
                  <span className="text-blue-600">Observaciones:</span>
                  <p className="font-medium break-words">{formData.observaciones}</p>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || Object.keys(errors).length > 0}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm order-1 sm:order-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTiempoModal;