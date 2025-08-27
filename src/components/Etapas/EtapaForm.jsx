import { useState, useEffect } from 'react';
import { useCategorias } from '../../hooks/useCategorias';
import { X, Check } from 'lucide-react';

export default function EtapaForm({ 
  onSubmit, 
  initialData = null, 
  loading = false, 
  onCancel 
}) {
  const { categorias, loading: categoriasLoading } = useCategorias();
  const [formData, setFormData] = useState({
    numero_etapa: '',
    nombre: '',
    descripcion: '',
    categorias_ids: [],
    distancia_km: '',
    activa: true
  });
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales cuando se edita
  useEffect(() => {
    if (initialData) {
      setFormData({
        numero_etapa: initialData.numero_etapa || '',
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        categorias_ids: initialData.categorias_ids || [],
        distancia_km: initialData.distancia_km || '',
        activa: initialData.activa !== undefined ? initialData.activa : true
      });
    } else {
      setFormData({
        numero_etapa: '',
        nombre: '',
        descripcion: '',
        categorias_ids: [],
        distancia_km: '',
        activa: true
      });
    }
    setErrors({});
  }, [initialData]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.numero_etapa) {
      newErrors.numero_etapa = 'El número de etapa es requerido';
    } else if (parseInt(formData.numero_etapa) <= 0) {
      newErrors.numero_etapa = 'El número de etapa debe ser mayor a 0';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la etapa es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.trim().length > 255) {
      newErrors.nombre = 'El nombre no debe exceder 255 caracteres';
    }

    if (formData.categorias_ids.length === 0) {
      newErrors.categorias_ids = 'Debe seleccionar al menos una categoría';
    }

    if (formData.descripcion && formData.descripcion.length > 1000) {
      newErrors.descripcion = 'La descripción no debe exceder 1000 caracteres';
    }

    if (formData.distancia_km && parseFloat(formData.distancia_km) <= 0) {
      newErrors.distancia_km = 'La distancia debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar selección de categorías
  const handleCategoriaToggle = (categoriaId) => {
    setFormData(prev => {
      const newCategorias = prev.categorias_ids.includes(categoriaId)
        ? prev.categorias_ids.filter(id => id !== categoriaId)
        : [...prev.categorias_ids, categoriaId];
      
      return {
        ...prev,
        categorias_ids: newCategorias
      };
    });

    // Limpiar error de categorías
    if (errors.categorias_ids) {
      setErrors(prev => ({
        ...prev,
        categorias_ids: ''
      }));
    }
  };

  // Seleccionar todas las categorías
  const handleSelectAll = () => {
    const allIds = categoriasArray.map(cat => cat.id);
    setFormData(prev => ({
      ...prev,
      categorias_ids: allIds
    }));
  };

  // Deseleccionar todas las categorías
  const handleDeselectAll = () => {
    setFormData(prev => ({
      ...prev,
      categorias_ids: []
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      numero_etapa: parseInt(formData.numero_etapa),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || null,
      categorias_ids: formData.categorias_ids,
      distancia_km: formData.distancia_km ? parseFloat(formData.distancia_km) : null,
      activa: formData.activa
    };

    onSubmit(submitData);
  };

  // Verificar si categorias es un array válido antes de renderizar
  const categoriasArray = Array.isArray(categorias) ? categorias : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Primera fila - Número y Distancia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Número de Etapa */}
        <div>
          <label 
            htmlFor="numero_etapa" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Número de Etapa *
          </label>
          <input
            type="number"
            id="numero_etapa"
            name="numero_etapa"
            value={formData.numero_etapa}
            onChange={handleChange}
            placeholder="Ej: 1"
            min="1"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
              errors.numero_etapa 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.numero_etapa && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.numero_etapa}</p>
          )}
        </div>

        {/* Distancia */}
        <div>
          <label 
            htmlFor="distancia_km" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Distancia (KM)
          </label>
          <input
            type="number"
            id="distancia_km"
            name="distancia_km"
            value={formData.distancia_km}
            onChange={handleChange}
            placeholder="Ej: 42.5"
            min="0"
            step="0.1"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
              errors.distancia_km 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.distancia_km && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.distancia_km}</p>
          )}
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label 
          htmlFor="nombre" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre de la Etapa *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ingrese el nombre de la etapa"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
            errors.nombre 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
          }`}
          disabled={loading}
          maxLength={255}
        />
        {errors.nombre && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      {/* Descripción - Opcional para móviles */}
      <div>
        <label 
          htmlFor="descripcion" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descripción <span className="text-xs text-gray-500">(opcional)</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción de la etapa..."
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none ${
            errors.descripcion 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
          }`}
          disabled={loading}
          maxLength={1000}
        />
        {errors.descripcion && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.descripcion}</p>
        )}
      </div>

      {/* Categorías (Selección Múltiple) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categorías * 
          <span className="text-xs sm:text-sm text-blue-600 ml-1">
            ({formData.categorias_ids.length} seleccionadas)
          </span>
        </label>
        
        {/* Botones de Selección Rápida */}
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 mb-3">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={loading || categoriasLoading}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            Seleccionar todas
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={loading || categoriasLoading}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Deseleccionar todas
          </button>
        </div>

        {/* Lista de Categorías */}
        <div className={`border rounded-md p-3 max-h-40 sm:max-h-48 overflow-y-auto ${
          errors.categorias_ids ? 'border-red-500' : 'border-gray-300'
        }`}>
          {categoriasLoading ? (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-4">Cargando categorías...</p>
          ) : categoriasArray.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-4">No hay categorías disponibles</p>
          ) : (
            <div className="space-y-2">
              {categoriasArray.map(categoria => (
                <label
                  key={categoria.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.categorias_ids.includes(categoria.id)}
                      onChange={() => handleCategoriaToggle(categoria.id)}
                      className="sr-only"
                      disabled={loading}
                    />
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      formData.categorias_ids.includes(categoria.id)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}>
                      {formData.categorias_ids.includes(categoria.id) && (
                        <Check className="w-2 h-2 sm:w-3 sm:h-3" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 flex-1">
                    {categoria.nombre}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {errors.categorias_ids && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.categorias_ids}</p>
        )}
      </div>

      {/* Estado Activa */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="activa"
          name="activa"
          checked={formData.activa}
          onChange={handleChange}
          className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={loading}
        />
        <label htmlFor="activa" className="ml-2 block text-xs sm:text-sm text-gray-900">
          Etapa activa
        </label>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || categoriasLoading}
          className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
        </button>
      </div>
    </form>
  );
}