import React from 'react';
import { Filter, X } from 'lucide-react';

const FiltrosTiempos = ({ etapas, categorias, filtros, onFiltrosChange }) => {
  const handleFiltroChange = (field, value) => {
    onFiltrosChange({ [field]: value });
  };

  const clearFiltros = () => {
    onFiltrosChange({
      etapaId: '',
      categoriaId: '',
      fechaDesde: '',
      fechaHasta: ''
    });
  };

  const hasFiltrosActivos = filtros.etapaId || filtros.categoriaId || filtros.fechaDesde || filtros.fechaHasta;

  return (
    <div className="space-y-4">
      {/* Primera fila - Selectores principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Filtro por etapa */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
            Etapa
          </label>
          <select
            value={filtros.etapaId}
            onChange={(e) => handleFiltroChange('etapaId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todas las etapas</option>
            {etapas.map(etapa => (
              <option key={etapa.id} value={etapa.id}>
                Etapa {etapa.numero_etapa}: {etapa.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por categoría */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
            Categoría
          </label>
          <select
            value={filtros.categoriaId}
            onChange={(e) => handleFiltroChange('categoriaId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre} (Salida: {categoria.hora_salida})
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por fecha desde */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
            Desde
          </label>
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            title="Fecha desde"
            placeholder="Fecha desde"
          />
        </div>

        {/* Filtro por fecha hasta */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
            Hasta
          </label>
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            title="Fecha hasta"
            placeholder="Fecha hasta"
          />
        </div>
      </div>

      {/* Segunda fila - Controles de filtros */}
      {hasFiltrosActivos && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pt-2 border-t border-gray-200">
          {/* Indicador de filtros activos */}
          <div className="flex items-center space-x-2 text-blue-600 text-sm">
            <Filter className="h-4 w-4" />
            <span>Filtros activos</span>
          </div>

          {/* Botón para limpiar filtros */}
          <button
            onClick={clearFiltros}
            className="flex items-center justify-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-300"
          >
            <X className="h-4 w-4" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltrosTiempos;