import { useState, useEffect, useCallback } from "react";

// Claves para localStorage
const STORAGE_KEYS = {
  ETAPAS: "control_tiempo_etapas",
  PARTICIPANTES: "control_tiempo_participantes",
  CATEGORIAS: "control_tiempo_categorias",
  HORA_SALIDA_BASE: "control_tiempo_hora_salida_base",
  CATEGORIA_FILTRO: "control_tiempo_categoria_filtro",
  LAST_UPDATE: "control_tiempo_last_update",
  UI_STATE: "control_tiempo_ui_state",
};

// Tiempo de caducidad de datos (30 minutos)
const DATA_EXPIRY_TIME = 30 * 60 * 1000;

// Hook para gestionar datos persistentes del control de tiempo
export const useControlTiempoData = () => {
  const [etapas, setEtapas] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [horaSalidaBase, setHoraSalidaBase] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);

  // Función para verificar si los datos necesitan actualizarse
  const shouldRefreshData = useCallback(() => {
    const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    if (!lastUpdate) return true;
    
    const timeSinceUpdate = Date.now() - parseInt(lastUpdate);
    return timeSinceUpdate > DATA_EXPIRY_TIME;
  }, []);

  // Función para marcar que los datos fueron actualizados
  const markDataUpdated = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
  }, []);

  // Función para limpiar todos los datos guardados
  const clearAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    setEtapas([]);
    setParticipantes([]);
    setCategorias([]);
    setHoraSalidaBase(null);
    setCategoriaFiltro("todos");
  }, []);

  // Cargar datos desde localStorage al inicializar
  useEffect(() => {
    const loadStoredData = () => {
      try {
        // Cargar etapas
        const storedEtapas = localStorage.getItem(STORAGE_KEYS.ETAPAS);
        if (storedEtapas) {
          setEtapas(JSON.parse(storedEtapas));
        }

        // Cargar participantes
        const storedParticipantes = localStorage.getItem(STORAGE_KEYS.PARTICIPANTES);
        if (storedParticipantes) {
          setParticipantes(JSON.parse(storedParticipantes));
        }

        // Cargar categorías
        const storedCategorias = localStorage.getItem(STORAGE_KEYS.CATEGORIAS);
        if (storedCategorias) {
          setCategorias(JSON.parse(storedCategorias));
        }

        // Cargar hora de salida base
        const storedHoraSalidaBase = localStorage.getItem(STORAGE_KEYS.HORA_SALIDA_BASE);
        if (storedHoraSalidaBase) {
          setHoraSalidaBase(storedHoraSalidaBase);
        }

        // Cargar filtro de categoría
        const storedCategoriaFiltro = localStorage.getItem(STORAGE_KEYS.CATEGORIA_FILTRO);
        if (storedCategoriaFiltro) {
          setCategoriaFiltro(storedCategoriaFiltro);
        }
      } catch (error) {
        console.error("Error cargando datos del localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Guardar etapas en localStorage cuando cambien
  useEffect(() => {
    if (etapas.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ETAPAS, JSON.stringify(etapas));
    }
  }, [etapas]);

  // Guardar participantes en localStorage cuando cambien
  useEffect(() => {
    if (participantes.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PARTICIPANTES, JSON.stringify(participantes));
    }
  }, [participantes]);

  // Guardar categorías en localStorage cuando cambien
  useEffect(() => {
    if (categorias.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(categorias));
    }
  }, [categorias]);

  // Guardar hora de salida base en localStorage cuando cambie
  useEffect(() => {
    if (horaSalidaBase) {
      localStorage.setItem(STORAGE_KEYS.HORA_SALIDA_BASE, horaSalidaBase);
    }
  }, [horaSalidaBase]);

  // Guardar filtro de categoría en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIA_FILTRO, categoriaFiltro);
  }, [categoriaFiltro]);

  return {
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
    isLoading,
    shouldRefreshData,
    markDataUpdated,
    clearAllData,
  };
};

// Hook para gestionar estado de UI persistente
export const useUIState = () => {
  const [uiState, setUIState] = useState({
    etapaActiva: null,
    showParticipantesPanel: false,
    sidebarCollapsed: false,
  });

  // Cargar estado de UI desde localStorage
  useEffect(() => {
    const loadUIState = () => {
      try {
        const storedUIState = localStorage.getItem(STORAGE_KEYS.UI_STATE);
        if (storedUIState) {
          setUIState(JSON.parse(storedUIState));
        }
      } catch (error) {
        console.error("Error cargando estado de UI:", error);
      }
    };

    loadUIState();
  }, []);

  // Guardar estado de UI en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UI_STATE, JSON.stringify(uiState));
  }, [uiState]);

  const updateUIState = useCallback((updates) => {
    setUIState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    uiState,
    updateUIState,
  };
};