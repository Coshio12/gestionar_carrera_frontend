import React from "react";
import { Clock } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useControlTiempoLogic } from "../hooks/useControlTiempoLogic";
import EtapaSelector from "../components/Cronometro/EtapaSelector";
import CronometroPanel from "../components/Cronometro/CronometroPanel";
import TiemposRegistrados from "../components/Cronometro/TiemposRegistrados";
import ParticipantesPanel from "../components/Cronometro/ParticipantesPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import HeaderControls from "../components/Cronometro/HeaderControls";

const ControlTiempo = () => {
  const {
    // Estados de carga
    isLoading,
    refreshingData,
    registrandoTiempo,
    
    // Datos
    etapas,
    participantes,
    categorias,
    participantesFiltrados,
    horaSalidaBase,
    categoriaFiltro,
    setCategoriaFiltro,
    
    // Cronómetro
    cronometroState,
    cronometroActions,
    
    // Tiempos
    lapTimes,
    calcularTiempoAjustado,
    
    // Handlers
    handleStartCronometro,
    handleEtapaChange,
    handleRegistrarTiempo,
    handleUpdateParticipante,
    guardarTiempo,
    refreshAllData,
    handleClearAllData,
    
    // Estados UI
    etapaActiva
  } = useControlTiempoLogic();

  // Carga inicial completa - mostrar con sidebar
  if (isLoading) {
    return (
      <LoadingSpinner 
        message="Cargando sistema de tiempos..." 
        subMessage="Restaurando datos guardados..."
        showSidebar={true}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <HeaderControls
            refreshAllData={refreshAllData}
            refreshingData={refreshingData}
            horaSalidaBase={horaSalidaBase}
            etapas={etapas}
            participantes={participantes}
            categorias={categorias}
            handleClearAllData={handleClearAllData}
          />

          {/* Selector de Etapas */}
          <EtapaSelector
            etapas={etapas}
            etapaActiva={etapaActiva}
            onEtapaChange={handleEtapaChange}
          />

          {/* Panel del Cronómetro */}
          <CronometroPanel
            cronometroState={cronometroState}
            cronometroActions={cronometroActions}
            etapaActiva={etapaActiva}
            horaSalidaBase={horaSalidaBase}
            onStartCronometro={handleStartCronometro}
            onRegistrarTiempo={handleRegistrarTiempo}
          />

          {/* Panel de Tiempos Registrados */}
          {registrandoTiempo ? (
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <LoadingSpinner 
                message="Registrando tiempo..." 
                subMessage="Por favor espere..."
                showSidebar={false}
                className="py-8"
              />
            </div>
          ) : (
            <TiemposRegistrados
              lapTimes={lapTimes}
              participantes={participantes}
              categorias={categorias}
              registrandoTiempo={registrandoTiempo}
              calcularTiempoAjustado={calcularTiempoAjustado}
              onUpdateParticipante={handleUpdateParticipante}
              onGuardarTiempo={guardarTiempo}
            />
          )}

          {/* Panel de Participantes */}
          {/* <ParticipantesPanel
            participantes={participantes}
            participantesFiltrados={participantesFiltrados}
            categorias={categorias}
            categoriaFiltro={categoriaFiltro}
            setCategoriaFiltro={setCategoriaFiltro}
            horaSalidaBase={horaSalidaBase}
          /> */}

          {/* Indicador de actualización de datos */}
          {refreshingData && (
            <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 sm:p-4 border-l-4 border-lime-500 z-50 max-w-xs">
              <LoadingSpinner 
                message="Actualizando datos..." 
                showSidebar={false}
                className="min-h-0"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ControlTiempo;