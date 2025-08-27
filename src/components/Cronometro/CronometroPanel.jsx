import React from "react";
import { Play, Square, Pause, Clock } from "lucide-react";

const CronometroPanel = ({
  cronometroState,
  cronometroActions,
  etapaActiva,
  horaSalidaBase,
  onStartCronometro,
  onRegistrarTiempo
}) => {
  const {
    isRunning,
    isPaused,
    formattedTime,
    canStart,
    canPause,
    canResume,
    canStop,
    canReset,
    canRegisterTime
  } = cronometroState;

  const {
    pause: pauseCronometro,
    resume: resumeCronometro,
    stop: stopCronometro,
    reset: resetCronometro
  } = cronometroActions;

  return (
    <div className="bg-black rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white mb-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        Cronómetro Master
      </h2>

      {/* Display del tiempo */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-3xl sm:text-5xl lg:text-6xl font-mono font-bold mb-2 sm:mb-4">
          {formattedTime}
        </div>
        <div className="text-sm sm:text-base lg:text-lg text-gray-400 px-2">
          {etapaActiva
            ? `Etapa ${etapaActiva.numero_etapa}: ${etapaActiva.nombre}`
            : "Seleccione una etapa"}
        </div>
        {horaSalidaBase && (
          <div className="text-xs sm:text-sm text-blue-400 mt-2 px-2">
            Iniciado a las {horaSalidaBase} - Todas las categorías
          </div>
        )}
        {isPaused && (
          <div className="text-yellow-400 text-xs sm:text-sm mt-2">⏸️ PAUSADO</div>
        )}
        {isRunning && !isPaused && (
          <div className="text-green-400 text-xs sm:text-sm mt-2">🏃 EN EJECUCIÓN</div>
        )}
      </div>

      {/* Controles del cronómetro */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 px-2">
        {canStart && (
          <button
            onClick={onStartCronometro}
            className="flex items-center space-x-1 sm:space-x-2 bg-green-600 hover:bg-green-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-semibold transition-colors text-sm sm:text-base"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Iniciar Cronómetro</span>
            <span className="sm:hidden">Iniciar</span>
          </button>
        )}

        {canPause && (
          <button
            onClick={pauseCronometro}
            className="flex items-center space-x-1 sm:space-x-2 bg-yellow-600 hover:bg-yellow-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-semibold transition-colors text-sm sm:text-base"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Pausar</span>
          </button>
        )}

        {canResume && (
          <button
            onClick={resumeCronometro}
            className="flex items-center space-x-1 sm:space-x-2 bg-green-600 hover:bg-green-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-semibold transition-colors text-sm sm:text-base"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Continuar</span>
          </button>
        )}

        {canStop && (
          <button
            onClick={stopCronometro}
            className="flex items-center space-x-1 sm:space-x-2 bg-red-600 hover:bg-red-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-semibold transition-colors text-sm sm:text-base"
          >
            <Square className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Detener</span>
          </button>
        )}

        {canReset && (
          <button
            onClick={resetCronometro}
            className="flex items-center space-x-1 sm:space-x-2 bg-gray-600 hover:bg-gray-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-semibold transition-colors text-sm sm:text-base"
          >
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Botón de registrar tiempo */}
      <div className="text-center px-2">
        <button
          onClick={onRegistrarTiempo}
          disabled={!canRegisterTime}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-colors w-full sm:w-auto"
        >
          <span className="hidden sm:inline">⏱️ Registrar Llegada</span>
          <span className="sm:hidden">⏱️ Registrar</span>
        </button>
        <p className="text-xs text-gray-400 mt-2 px-2">
          <span className="hidden sm:inline">Presione cuando un participante cruce la meta</span>
          <span className="sm:hidden">Presione al cruzar la meta</span>
        </p>
      </div>
    </div>
  );
};

export default CronometroPanel;