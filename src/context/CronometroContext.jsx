import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';

// Estados del cronómetro
const CRONOMETRO_STATES = {
  STOPPED: 'stopped',
  RUNNING: 'running',
  PAUSED: 'paused'
};

// Acciones del reducer
const CRONOMETRO_ACTIONS = {
  START: 'START',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
  STOP: 'STOP',
  RESET: 'RESET',
  TICK: 'TICK',
  SET_ETAPA: 'SET_ETAPA',
  ADD_LAP: 'ADD_LAP',
  UPDATE_PARTICIPANTE: 'UPDATE_PARTICIPANTE',
  MARK_LAP_SAVED: 'MARK_LAP_SAVED'
};

// Estado inicial
const initialState = {
  state: CRONOMETRO_STATES.STOPPED,
  time: 0,
  startTime: null,
  pausedTime: 0,
  etapaActiva: null,
  lapTimes: [],
  lapCounter: 0
};

// Reducer del cronómetro
const cronometroReducer = (state, action) => {
  switch (action.type) {
    case CRONOMETRO_ACTIONS.START:
      return {
        ...state,
        state: CRONOMETRO_STATES.RUNNING,
        startTime: Date.now(),
        pausedTime: 0,
        etapaActiva: action.payload
      };

    case CRONOMETRO_ACTIONS.PAUSE:
      return {
        ...state,
        state: CRONOMETRO_STATES.PAUSED,
        pausedTime: state.time
      };

    case CRONOMETRO_ACTIONS.RESUME:
      return {
        ...state,
        state: CRONOMETRO_STATES.RUNNING,
        startTime: Date.now() - state.pausedTime
      };

    case CRONOMETRO_ACTIONS.STOP:
      return {
        ...state,
        state: CRONOMETRO_STATES.STOPPED
      };

    case CRONOMETRO_ACTIONS.RESET:
      return {
        ...initialState,
        etapaActiva: state.etapaActiva
      };

    case CRONOMETRO_ACTIONS.TICK:
      if (state.state === CRONOMETRO_STATES.RUNNING) {
        return {
          ...state,
          time: Date.now() - state.startTime
        };
      }
      return state;

    case CRONOMETRO_ACTIONS.SET_ETAPA:
      return {
        ...state,
        etapaActiva: action.payload
      };

    case CRONOMETRO_ACTIONS.ADD_LAP:
      return {
        ...state,
        lapTimes: [...state.lapTimes, action.payload],
        lapCounter: state.lapCounter + 1
      };

    case CRONOMETRO_ACTIONS.UPDATE_PARTICIPANTE:
      return {
        ...state,
        lapTimes: state.lapTimes.map(lap =>
          lap.id === action.payload.lapId
            ? {
                ...lap,
                participante_id: action.payload.participanteId,
                participante_nombre: action.payload.participanteNombre
              }
            : lap
        )
      };

    case CRONOMETRO_ACTIONS.MARK_LAP_SAVED:
      return {
        ...state,
        lapTimes: state.lapTimes.map(lap =>
          lap.id === action.payload.lapId
            ? { ...lap, guardado: true }
            : lap
        )
      };

    default:
      return state;
  }
};

// Contexto
const CronometroContext = createContext();

// Provider del contexto
export const CronometroProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cronometroReducer, initialState);
  const intervalRef = useRef(null);

  // Función para formatear tiempo
  const formatTime = useCallback((timeMs) => {
    if (!timeMs || timeMs < 0) return '00:00.00';
    
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const centiseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  // Efecto para manejar el intervalo del cronómetro
  useEffect(() => {
    if (state.state === CRONOMETRO_STATES.RUNNING) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: CRONOMETRO_ACTIONS.TICK });
      }, 10); // Actualizar cada 10ms para mejor precisión
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.state]);

  // Acciones del cronómetro
  const startCronometro = useCallback((etapa) => {
    dispatch({ type: CRONOMETRO_ACTIONS.START, payload: etapa });
  }, []);

  const pauseCronometro = useCallback(() => {
    dispatch({ type: CRONOMETRO_ACTIONS.PAUSE });
  }, []);

  const resumeCronometro = useCallback(() => {
    dispatch({ type: CRONOMETRO_ACTIONS.RESUME });
  }, []);

  const stopCronometro = useCallback(() => {
    dispatch({ type: CRONOMETRO_ACTIONS.STOP });
  }, []);

  const resetCronometro = useCallback(() => {
    dispatch({ type: CRONOMETRO_ACTIONS.RESET });
  }, []);

  const setEtapaActiva = useCallback((etapa) => {
    dispatch({ type: CRONOMETRO_ACTIONS.SET_ETAPA, payload: etapa });
  }, []);

  const registrarTiempo = useCallback(() => {
    if (state.state !== CRONOMETRO_STATES.RUNNING) {
      return null;
    }

    const lapTime = {
      id: `lap_${Date.now()}_${state.lapCounter}`,
      tiempo: state.time,
      timestamp: Date.now(),
      participante_id: null,
      participante_nombre: null,
      guardado: false
    };

    dispatch({ type: CRONOMETRO_ACTIONS.ADD_LAP, payload: lapTime });
    return lapTime;
  }, [state.state, state.time, state.lapCounter]);

  const updateParticipanteEnTiempo = useCallback((lapId, participanteId, participanteNombre) => {
    dispatch({
      type: CRONOMETRO_ACTIONS.UPDATE_PARTICIPANTE,
      payload: { lapId, participanteId, participanteNombre }
    });
  }, []);

  const markLapAsSaved = useCallback((lapId) => {
    dispatch({
      type: CRONOMETRO_ACTIONS.MARK_LAP_SAVED,
      payload: { lapId }
    });
  }, []);

  // Estados calculados
  const isRunning = state.state === CRONOMETRO_STATES.RUNNING;
  const isPaused = state.state === CRONOMETRO_STATES.PAUSED;
  const isStopped = state.state === CRONOMETRO_STATES.STOPPED;

  // Capacidades del cronómetro
  const canStart = isStopped && state.etapaActiva;
  const canPause = isRunning;
  const canResume = isPaused;
  const canStop = isRunning || isPaused;
  const canReset = isStopped || isPaused;
  const canRegisterTime = isRunning;

  // Tiempo formateado
  const formattedTime = formatTime(state.time);

  // Valor del contexto
  const contextValue = {
    // Estado
    isRunning,
    isPaused,
    isStopped,
    time: state.time,
    formattedTime,
    etapaActiva: state.etapaActiva,
    lapTimes: state.lapTimes,
    
    // Capacidades
    canStart,
    canPause,
    canResume,
    canStop,
    canReset,
    canRegisterTime,
    
    // Acciones
    startCronometro,
    pauseCronometro,
    resumeCronometro,
    stopCronometro,
    resetCronometro,
    setEtapaActiva,
    registrarTiempo,
    updateParticipanteEnTiempo,
    markLapAsSaved,
    
    // Utilidades
    formatTime
  };

  return (
    <CronometroContext.Provider value={contextValue}>
      {children}
    </CronometroContext.Provider>
  );
};

// Hook para usar el contexto
export const useCronometro = () => {
  const context = useContext(CronometroContext);
  if (!context) {
    throw new Error('useCronometro debe ser usado dentro de un CronometroProvider');
  }
  return context;
};

export default CronometroContext;