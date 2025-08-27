import React from "react";
import { Trophy } from "lucide-react";

const EtapaSelector = ({ etapas, etapaActiva, onEtapaChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
        <span className="hidden sm:inline">Seleccionar Etapa</span>
        <span className="sm:hidden">Etapas</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {etapas.map((etapa) => (
          <button
            key={etapa.id}
            onClick={() => onEtapaChange(etapa)}
            className={`p-3 sm:px-4 sm:py-3 rounded-lg font-medium transition-colors text-left ${
              etapaActiva?.id === etapa.id
                ? "bg-lime-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <div className="text-sm sm:text-base font-semibold">
              Etapa {etapa.numero_etapa}
            </div>
            <div className="text-xs sm:text-sm mt-1 truncate">
              {etapa.nombre}
            </div>
            <div className="text-xs opacity-75 mt-1">
              Todas las categorías
            </div>
          </button>
        ))}
      </div>
      
      {etapas.length === 0 && (
        <div className="text-center text-gray-500 py-6 sm:py-8">
          <Trophy className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm sm:text-base">No hay etapas disponibles</p>
        </div>
      )}
    </div>
  );
};

export default EtapaSelector;