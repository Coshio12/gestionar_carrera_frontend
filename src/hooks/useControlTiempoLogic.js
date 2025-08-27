import { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext";
import { useCronometro } from "../context/CronometroContext";
import { useControlTiempoData, useUIState } from "../hooks/usePersistentData";
import { useApiOperations } from "../hooks/useApiOperations";
import { useTimeCalculations } from "../hooks/useTimeCalculations";

export const useControlTiempoLogic = () => {
  // Estados de datos persistentes

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000'
  const {
    etapas,
    setEtapas,
    participantes,
    setParticipantes,
    categorias,
    setCategorias,
    horaSalidaBase,
    setHoraSalidaBase,
    categoriaFiltro,
    setCategoriaFiltro,
    isLoading: loadingPersistentData,
    markDataUpdated,
    shouldRefreshData,
    clearAllData,
  } = useControlTiempoData();

  const { uiState, updateUIState } = useUIState();

  // Estados locales
  const [initialLoading, setInitialLoading] = useState(true);
  const [registrandoTiempo, setRegistrandoTiempo] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);

  const { showSuccess, showError, showInfo } = useToast();

  // Contexto del cronómetro
  const cronometroContext = useCronometro();
  const {
    isRunning,
    isPaused,
    formattedTime,
    lapTimes,
    etapaActiva,
    canStart,
    canPause,
    canResume,
    canStop,
    canReset,
    canRegisterTime,
    startCronometro,
    pauseCronometro,
    resumeCronometro,
    stopCronometro,
    resetCronometro,
    registrarTiempo,
    updateParticipanteEnTiempo,
    markLapAsSaved,
    setEtapaActiva,
    formatTime,
  } = cronometroContext;

  // Hooks personalizados
  const { fetchEtapas, fetchCategorias, fetchParticipantes, fetchHoraSalidaBase } = useApiOperations({
    etapas, setEtapas, categorias, setCategorias, participantes, setParticipantes,
    markDataUpdated, showError, setEtapaActiva, etapaActiva
  });

  const { timeToMinutes, calcularDiferenciaSalida } = useTimeCalculations();

  // Calcular participantes filtrados
  const participantesFiltrados = categoriaFiltro === "todos"
    ? participantes
    : participantes.filter((p) => p.categoria_id === categoriaFiltro);

  // Estado del cronómetro para pasar a componentes
  const cronometroState = {
    isRunning,
    isPaused,
    formattedTime,
    canStart,
    canPause,
    canResume,
    canStop,
    canReset,
    canRegisterTime,
  };

  const cronometroActions = {
    start: startCronometro,
    pause: pauseCronometro,
    resume: resumeCronometro,
    stop: stopCronometro,
    reset: resetCronometro,
    register: registrarTiempo,
  };

  // Refrescar todos los datos
  const refreshAllData = useCallback(async () => {
    setRefreshingData(true);
    showInfo("Actualizando datos...");

    try {
      await Promise.all([
        fetchEtapas(true),
        fetchCategorias(true),
        fetchParticipantes(true),
      ]);

      // Actualizar hora de salida base
      if (categorias.length === 0) {
        const horaSalida = await fetchHoraSalidaBase();
        if (horaSalida) {
          setHoraSalidaBase(horaSalida);
        }
      }

      showSuccess("Datos actualizados correctamente");
    } catch (error) {
      showError("Error actualizando datos");
    } finally {
      setRefreshingData(false);
    }
  }, [fetchEtapas, fetchCategorias, fetchParticipantes, fetchHoraSalidaBase, categorias.length, setHoraSalidaBase, showInfo, showSuccess, showError]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);

      try {
        // Verificar si necesitamos refrescar datos
        const needsRefresh = shouldRefreshData() ||
          etapas.length === 0 ||
          participantes.length === 0 ||
          categorias.length === 0;

        if (needsRefresh) {
          // Cargar datos básicos en paralelo
          const [etapasData, categoriasData, participantesData] = await Promise.all([
            fetchEtapas(true),
            fetchCategorias(true),
            fetchParticipantes(true),
          ]);

          // Si no tenemos hora de salida base, calcularla o cargarla
          if (!horaSalidaBase && categoriasData.length > 0) {
            const categoriaBase = categoriasData.reduce((prev, current) => {
              const prevTime = timeToMinutes(prev.hora_salida);
              const currentTime = timeToMinutes(current.hora_salida);
              return prevTime < currentTime ? prev : current;
            });
            setHoraSalidaBase(categoriaBase.hora_salida);
          }

          // Si hay etapas pero no hay etapa activa, seleccionar la primera
          if (etapasData.length > 0 && !etapaActiva) {
            setEtapaActiva(etapasData[0]);
          }
        } else {
          
          // Si tenemos datos en cache pero no hay etapa activa, seleccionar la primera
          if (etapas.length > 0 && !etapaActiva) {
            setEtapaActiva(etapas[0]);
          }

          // Si no tenemos hora de salida base pero sí categorías, calcularla
          if (!horaSalidaBase && categorias.length > 0) {
            const categoriaBase = categorias.reduce((prev, current) => {
              const prevTime = timeToMinutes(prev.hora_salida);
              const currentTime = timeToMinutes(current.hora_salida);
              return prevTime < currentTime ? prev : current;
            });
            setHoraSalidaBase(categoriaBase.hora_salida);
          }
        }
      } catch (error) {
        console.error("Error en loadInitialData:", error);
        showError("Error cargando datos iniciales");
      } finally {
        setInitialLoading(false);
      }
    };

    if (!loadingPersistentData) {
      loadInitialData();
    }
  }, [
    loadingPersistentData,
    shouldRefreshData,
    etapas.length,
    participantes.length,
    categorias.length,
    etapas,
    categorias,
    horaSalidaBase,
    etapaActiva,
    fetchEtapas,
    fetchCategorias,
    fetchParticipantes,
    setHoraSalidaBase,
    setEtapaActiva,
    timeToMinutes,
    showError,
  ]);

  // Calcular tiempo ajustado según categoría
  const calcularTiempoAjustado = useCallback(
    (participanteId, tiempoCronometrado) => {
      const participante = participantes.find((p) => p.id === participanteId);
      if (!participante || !horaSalidaBase) return tiempoCronometrado;

      const categoria = categorias.find(
        (c) => c.id === participante.categoria_id
      );
      if (!categoria || !categoria.hora_salida) return tiempoCronometrado;

      const diferenciaSalida = calcularDiferenciaSalida(
        categoria.hora_salida,
        horaSalidaBase
      );
      return tiempoCronometrado + diferenciaSalida;
    },
    [participantes, categorias, horaSalidaBase, calcularDiferenciaSalida]
  );

  // Handlers
  const handleStartCronometro = useCallback(() => {
    if (etapaActiva && horaSalidaBase) {
      startCronometro(etapaActiva);
    } else {
      showError("Debe seleccionar una etapa antes de iniciar el cronómetro");
    }
  }, [etapaActiva, horaSalidaBase, startCronometro, showError]);

  const handleEtapaChange = useCallback(
    (etapa) => {
      setEtapaActiva(etapa);
    },
    [setEtapaActiva]
  );

  const handleRegistrarTiempo = useCallback(() => {
    const lapTime = registrarTiempo();
    if (!lapTime) {
      showError("No se puede registrar tiempo en este momento");
    }
  }, [registrarTiempo, showError]);

  const handleUpdateParticipante = useCallback(
    (lapId, participanteId) => {
      if (!participanteId || participanteId === "" || participanteId === "null") {
        updateParticipanteEnTiempo(lapId, null, null);
        return;
      }

      const participante = participantes.find((p) => p.id === participanteId);

      if (participante) {
        // Buscar la categoría del participante
        let categoria = null;
        if (participante.categorias) {
          // Si viene anidada desde la consulta
          categoria = participante.categorias;
        } else if (participante.categoria_id) {
          // Buscar en el array de categorías
          categoria = categorias.find((c) => c.id === participante.categoria_id);
        }

        const participanteNombre = `${participante.nombre} ${
          participante.apellidos
        } (${participante.dorsal}) - ${categoria?.nombre || "Sin categoría"}`;
        updateParticipanteEnTiempo(lapId, participanteId, participanteNombre);
      }
    },
    [participantes, categorias, updateParticipanteEnTiempo]
  );

  // Guardar tiempo en base de datos
  // Guardar tiempo en base de datos
const guardarTiempo = useCallback(
  async (lapTime) => {
    if (!lapTime.participante_id || !etapaActiva) {
      showError("Debe seleccionar un participante");
      return;
    }

    // Validar que el tiempo del lapTime sea válido
    if (!lapTime.tiempo || isNaN(lapTime.tiempo) || lapTime.tiempo <= 0) {
      showError("El tiempo registrado no es válido");
      return;
    }

    setRegistrandoTiempo(true);

    try {
      const token = localStorage.getItem("token");
      const participante = participantes.find(
        (p) => p.id === lapTime.participante_id
      );

      // El tiempo que enviamos al servidor debe ser el tiempo original del cronómetro
      // El servidor calculará el tiempo final basado en la categoría
      const tiempoData = {
        participante_id: participante?.id || lapTime.participante_id,
        etapa_id: etapaActiva.id,
        tiempo: lapTime.tiempo, // Usar el tiempo original del cronómetro
        penalizacion: 0,
        observaciones: null,
      };
    
      const response = await fetch(`${API_URL}/api/tiempos/tiempos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tiempoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la respuesta del servidor");
      }

      const result = await response.json();

      markLapAsSaved(lapTime.id);

      // Buscar la categoría del participante para mostrar información
      let categoria = null;
      if (participante?.categorias) {
        categoria = participante.categorias;
      } else if (participante?.categoria_id) {
        categoria = categorias.find((c) => c.id === participante.categoria_id);
      }

      // Calcular tiempo ajustado solo para mostrar en el mensaje
      const tiempoAjustado = calcularTiempoAjustado(
        lapTime.participante_id,
        lapTime.tiempo
      );

      const diferenciaSalidaMs = categoria && horaSalidaBase
        ? calcularDiferenciaSalida(categoria.hora_salida, horaSalidaBase)
        : 0;
      const diferenciaSalidaMin = diferenciaSalidaMs / (1000 * 60);

      showSuccess(
        `✅ Tiempo guardado para ${lapTime.participante_nombre}

📊 Detalles del registro:
• Tiempo cronómetro: ${formatTime(lapTime.tiempo)}
• Tiempo final guardado: ${formatTime(tiempoAjustado)}
• Diferencia de salida: +${diferenciaSalidaMin.toFixed(1)} minutos
• Categoría: ${categoria?.nombre || "N/A"}
• Hora salida: ${categoria?.hora_salida || "N/A"}`
      );
    } catch (error) {
      console.error("Error guardando tiempo:", error);
      showError(error.message || "Error guardando tiempo");
    } finally {
      setRegistrandoTiempo(false);
    }
  },
  [
    etapaActiva,
    calcularTiempoAjustado,
    participantes,
    markLapAsSaved,
    categorias,
    horaSalidaBase,
    calcularDiferenciaSalida,
    formatTime,
    showSuccess,
    showError,
  ]
);

  // Función para limpiar todos los datos
  const handleClearAllData = useCallback(() => {
    if (
      window.confirm(
        "¿Está seguro de que desea limpiar todos los datos guardados? Esta acción no se puede deshacer."
      )
    ) {
      clearAllData();
      showInfo("Todos los datos han sido limpiados");
    }
  }, [clearAllData, showInfo]);

  const isLoading = initialLoading || loadingPersistentData;

  return {
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
    etapaActiva,
  };
};