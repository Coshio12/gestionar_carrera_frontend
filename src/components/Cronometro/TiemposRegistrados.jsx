import React from "react";
import { User, Clock, Save } from "lucide-react";
import ParticipantSearch from "../ParticipantSearch";

const TiemposRegistrados = ({
  lapTimes,
  participantes,
  categorias,
  registrandoTiempo,
  calcularTiempoAjustado,
  onUpdateParticipante,
  onGuardarTiempo
}) => {
  const formatTime = (milliseconds) => {
    // Validar que milliseconds sea un número válido
    if (!milliseconds || isNaN(milliseconds)) {
      return "00:00.00";
    }
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return hours > 0
      ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`
      : `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  // Validar que lapTimes sea un array
  const validLapTimes = Array.isArray(lapTimes) ? lapTimes : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
        <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-lime-400" />
        <span className="hidden sm:inline">
          Tiempos Registrados ({validLapTimes.length})
        </span>
        <span className="sm:hidden">
          Registros ({validLapTimes.length})
        </span>
      </h2>

      <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {validLapTimes.length === 0 ? (
          <div className="text-center text-gray-500 py-6 sm:py-8">
            <Clock className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm sm:text-base">No hay tiempos registrados</p>
            <p className="text-xs sm:text-sm mt-1">Use el cronómetro para registrar tiempos</p>
          </div>
        ) : (
          validLapTimes.map((lapTime, index) => {
            // Validaciones de seguridad para lapTime
            if (!lapTime) return null;

            const tiempoAjustado = lapTime.participante_id && calcularTiempoAjustado
              ? calcularTiempoAjustado(lapTime.participante_id, lapTime.tiempo)
              : lapTime.tiempo;

            // Usar index + 1 como fallback si vuelta no existe
            const numeroVuelta = lapTime.vuelta ?? (index + 1);
            
            // Validar timestamp
            const timestamp = lapTime.timestamp ? new Date(lapTime.timestamp) : new Date();
            const timeString = timestamp instanceof Date && !isNaN(timestamp) 
              ? timestamp.toLocaleTimeString() 
              : "Hora inválida";

            return (
              <div
                key={lapTime.id || `lap-${index}`}
                className="border rounded-lg p-3 sm:p-4 bg-gray-50 hover:shadow-md transition-shadow relative"
                style={{ zIndex: 10 + index, position: "relative" }}
              >
                {/* Header con número de vuelta y tiempo */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0">
                      #{numeroVuelta.toString().padStart(2, "0")}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-sm sm:text-base lg:text-lg font-bold text-gray-700 truncate">
                        <span className="hidden sm:inline">Cronómetro: </span>
                        {formatTime(lapTime.tiempo)}
                      </span>
                      {lapTime.participante_id && tiempoAjustado !== lapTime.tiempo && (
                        <span className="font-mono text-sm sm:text-base lg:text-lg font-bold text-green-600 truncate">
                          <span className="hidden sm:inline">Tiempo final: </span>
                          <span className="sm:hidden">Final: </span>
                          {formatTime(tiempoAjustado)}
                        </span>
                      )}
                      {lapTime.participante_id && tiempoAjustado === lapTime.tiempo && (
                        <span className="text-xs sm:text-sm text-blue-600">
                          <span className="hidden sm:inline">(Categoría masters - sin ajuste)</span>
                          <span className="sm:hidden">(Sin ajuste)</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {timeString}
                      </span>
                    </div>
                  </div>
                  {lapTime.guardado && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold flex-shrink-0 self-start sm:self-center">
                      <span className="hidden sm:inline">✓ Guardado</span>
                      <span className="sm:hidden">✓</span>
                    </span>
                  )}
                </div>

                {/* Sección de participante y botón guardar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 relative">
                  <div className="flex-1 relative" style={{ zIndex: 1000 + index }}>
                    <ParticipantSearch
                      participantes={participantes || []}
                      categorias={categorias || []}
                      selectedParticipantId={lapTime.participante_id}
                      onSelectParticipant={(participanteId) => {
                        if (onUpdateParticipante) {
                          onUpdateParticipante(lapTime.id || `lap-${index}`, participanteId);
                        }
                      }}
                      disabled={lapTime.guardado}
                      placeholder="Buscar por dorsal, nombre o categoría..."
                      maxResults={15}
                      showKeyboardHelp={true}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (onGuardarTiempo) {
                        onGuardarTiempo(lapTime);
                      }
                    }}
                    disabled={
                      !lapTime.participante_id || lapTime.guardado || registrandoTiempo
                    }
                    className="flex items-center justify-center space-x-1 sm:space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 sm:px-4 py-2 rounded font-medium transition-colors flex-shrink-0 w-full sm:w-auto text-sm sm:text-base"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      {registrandoTiempo ? (
                        <span className="hidden sm:inline">Guardando...</span>
                      ) : (
                        "Guardar"
                      )}
                      {registrandoTiempo && <span className="sm:hidden">...</span>}
                    </span>
                  </button>
                </div>
              </div>
            );
          }).filter(Boolean) // Filtrar elementos null
        )}
      </div>
    </div>
  );
};

export default TiemposRegistrados;