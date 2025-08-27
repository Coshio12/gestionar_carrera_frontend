import React from "react";
import { Clock, RefreshCw, Trash2, Users, Timer, Target } from "lucide-react";

const HeaderControls = ({
  refreshAllData,
  refreshingData,
  horaSalidaBase,
  etapas,
  participantes,
  categorias,
  handleClearAllData,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      {/* Título principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-lime-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Control de Tiempos
            </h1>
            <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
              Sistema de cronometraje y registro de tiempos
            </p>
            <p className="text-xs text-gray-600 sm:hidden">
              Cronometraje y registro
            </p>
          </div>
        </div>

        {/* Controles del header */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={refreshAllData}
            disabled={refreshingData}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${refreshingData ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {refreshingData ? 'Actualizando...' : 'Actualizar'}
            </span>
            <span className="sm:hidden">
              {refreshingData ? '...' : 'Actualizar'}
            </span>
          </button>

          <button
            onClick={handleClearAllData}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Limpiar Datos</span>
            <span className="sm:hidden">Limpiar</span>
          </button>
        </div>
      </div>

      {/* Información del sistema */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Hora de salida base */}
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span className="font-medium text-green-800 text-xs sm:text-sm">
              <span className="hidden sm:inline">Hora Base</span>
              <span className="sm:hidden">Base</span>
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-green-900 truncate">
            {horaSalidaBase || 'N/A'}
          </p>
          <p className="text-xs sm:text-sm text-green-600">
            <span className="hidden sm:inline">Hora de salida base</span>
            <span className="sm:hidden">Salida</span>
          </p>
        </div>

        {/* Total de etapas */}
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="font-medium text-blue-800 text-xs sm:text-sm">Etapas</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-blue-900">
            {etapas?.length || 0}
          </p>
          <p className="text-xs sm:text-sm text-blue-600">
            <span className="hidden sm:inline">Etapas activas</span>
            <span className="sm:hidden">Activas</span>
          </p>
        </div>

        {/* Total de participantes */}
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <span className="font-medium text-purple-800 text-xs sm:text-sm">
              <span className="hidden sm:inline">Participantes</span>
              <span className="sm:hidden">Corredores</span>
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-purple-900">
            {participantes?.length || 0}
          </p>
          <p className="text-xs sm:text-sm text-purple-600">
            <span className="hidden sm:inline">Registrados</span>
            <span className="sm:hidden">Total</span>
          </p>
        </div>

        {/* Total de categorías */}
        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            <span className="font-medium text-orange-800 text-xs sm:text-sm">
              <span className="hidden sm:inline">Categorías</span>
              <span className="sm:hidden">Categorias</span>
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-orange-900">
            {categorias?.length || 0}
          </p>
          <p className="text-xs sm:text-sm text-orange-600">
            <span className="hidden sm:inline">Disponibles</span>
            <span className="sm:hidden">Total</span>
          </p>
        </div>
      </div>

      {/* Estado del sistema */}
      <div className="mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
          <span>Estado del sistema:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-green-700">Operativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderControls;