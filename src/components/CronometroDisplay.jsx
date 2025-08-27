import React from 'react';
import { Clock, Play, Square, Pause } from 'lucide-react';
import { useCronometro } from '../context/CronometroContext';

export const CronometroSidebar = ({ className = "" }) => {
  const {
    isRunning,
    isPaused,
    formattedTime,
    etapaActiva,
    lapTimes
  } = useCronometro();

  return (
    <div className={`bg-gray-800 border border-gray-600 rounded-lg p-3 sm:p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
          <span className="text-xs sm:text-sm font-semibold text-white">Cronómetro</span>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center space-x-1">
          {isRunning && !isPaused && (
            <div className="flex items-center space-x-1">
              <Play className="w-2 h-2 sm:w-3 sm:h-3 text-green-400" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
          {isPaused && (
            <div className="flex items-center space-x-1">
              <Pause className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full"></div>
            </div>
          )}
          {!isRunning && (
            <div className="flex items-center space-x-1">
              <Square className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="text-center">
        {/* Time display */}
        <div className="font-mono text-base sm:text-lg font-bold text-white mb-2">
          {formattedTime}
        </div>
        
        {/* Current stage info */}
        {etapaActiva && (
          <div className="text-xs text-gray-300 mb-2 truncate">
            <span className="hidden sm:inline">Etapa {etapaActiva.numero_etapa}: </span>
            <span className="sm:hidden">E{etapaActiva.numero_etapa}: </span>
            {etapaActiva.nombre}
          </div>
        )}
        
        {/* Status info */}
        <div className="flex justify-between text-xs text-gray-100">
          <span className="truncate">
            <span className="hidden sm:inline">Estado: </span>
            {isRunning ? (isPaused ? 'Pausado' : 'Corriendo') : 'Detenido'}
          </span>
          <span className="truncate">
            <span className="hidden sm:inline">Registros: </span>
            <span className="sm:hidden">R: </span>
            {lapTimes.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CronometroSidebar;