import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

export const useRegistroRapido = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000'
  const [etapas, setEtapas] = useState([]);
  const [etapaSeleccionada, setEtapaSeleccionada] = useState('');
  const [dorsal, setDorsal] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [posicion, setPosicion] = useState('');
  const [aplicarBonificacion, setAplicarBonificacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [participante, setParticipante] = useState(null);
  const [tiemposRecientes, setTiemposRecientes] = useState([]);

  const { showSuccess, showError, showInfo } = useToast();

  // Bonificaciones según reglamento
  const bonificaciones = {
    1: 10000, // 10 segundos en milisegundos
    2: 6000,  // 6 segundos
    3: 4000,  // 4 segundos
    4: 2000,  // 2 segundos
    5: 1000   // 1 segundo
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}` };
  };

  // Cargar etapas
  const cargarEtapas = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/tiempos/etapas`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Error cargando etapas');
      
      const data = await response.json();
      setEtapas(data.etapas || []);
      
      // Seleccionar la primera etapa por defecto
      if (data.etapas && data.etapas.length > 0) {
        setEtapaSeleccionada(data.etapas[0].id);
      }
    } catch (error) {
      showError('Error cargando etapas: ' + error.message);
    }
  }, [showError]);

  // Buscar participante por dorsal
  const buscarParticipante = useCallback(async (dorsalBuscado) => {
    if (!dorsalBuscado) {
      setParticipante(null);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tiempos/participantes/dorsal/${dorsalBuscado}`, {
        headers: getAuthHeaders()
      });
      
      if (response.status === 404) {
        setParticipante(null);
        showInfo(`No se encontró participante con dorsal ${dorsalBuscado}`);
        return;
      }
      
      if (!response.ok) throw new Error('Error buscando participante');
      
      const data = await response.json();
      setParticipante(data.success ? data.participante : null);
      
    } catch (error) {
      showError('Error buscando participante: ' + error.message);
      setParticipante(null);
    }
  }, [showError, showInfo]);

  // Convertir tiempo string a milisegundos
  const convertirTiempoAMs = useCallback((tiempoStr) => {
    const partes = tiempoStr.split(':');
    let horas = 0, minutos = 0, segundos = 0, centisegundos = 0;
    
    if (partes.length === 3) {
      // HH:MM:SS.CC
      horas = parseInt(partes[0]) || 0;
      minutos = parseInt(partes[1]) || 0;
      const segundosParte = partes[2].split('.');
      segundos = parseInt(segundosParte[0]) || 0;
      centisegundos = parseInt(segundosParte[1]) || 0;
    } else if (partes.length === 2) {
      // MM:SS.CC
      minutos = parseInt(partes[0]) || 0;
      const segundosParte = partes[1].split('.');
      segundos = parseInt(segundosParte[0]) || 0;
      centisegundos = parseInt(segundosParte[1]) || 0;
    } else {
      throw new Error('Formato de tiempo inválido. Use MM:SS.CC o HH:MM:SS.CC');
    }
    
    return (horas * 3600 + minutos * 60 + segundos) * 1000 + (centisegundos * 10);
  }, []);

  // Formatear tiempo de milisegundos a string
  const formatearTiempo = useCallback((tiempoMs) => {
    const horas = Math.floor(tiempoMs / 3600000);
    const minutos = Math.floor((tiempoMs % 3600000) / 60000);
    const segundos = Math.floor((tiempoMs % 60000) / 1000);
    const centisegundos = Math.floor((tiempoMs % 1000) / 10);
    
    if (horas > 0) {
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}.${centisegundos.toString().padStart(2, '0')}`;
    } else {
      return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}.${centisegundos.toString().padStart(2, '0')}`;
    }
  }, []);

  // Registrar tiempo
  const registrarTiempo = useCallback(async () => {
    if (!etapaSeleccionada || !dorsal || !tiempo) {
      showError('Debe completar etapa, dorsal y tiempo');
      return false;
    }

    if (!participante) {
      showError('No se encontró el participante con el dorsal especificado');
      return false;
    }

    setLoading(true);

    try {
      // Convertir tiempo a milisegundos
      const tiempoMs = convertirTiempoAMs(tiempo);
      
      const tiempoData = {
        participante_id: participante.id,
        etapa_id: parseInt(etapaSeleccionada),
        tiempo: tiempoMs,
        posicion: posicion ? parseInt(posicion) : null,
        penalizacion: 0,
        aplicar_bonificacion: aplicarBonificacion,
        observaciones: null
      };

      const response = await fetch(`${API_URL}/api/tiempos/tiempos/rapido`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tiempoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error guardando tiempo');
      }

      const result = await response.json();
      
      // Agregar a tiempos recientes
      const nuevoRegistro = {
        id: result.tiempo.id,
        dorsal: dorsal,
        participante: `${participante.nombre} ${participante.apellidos}`,
        tiempo: formatearTiempo(tiempoMs),
        etapa: etapas.find(e => e.id === parseInt(etapaSeleccionada))?.nombre,
        timestamp: new Date().toLocaleTimeString(),
        bonificacion: result.bonificacion_aplicada > 0 
          ? `${result.bonificacion_aplicada/1000}s` 
          : null
      };
      
      setTiemposRecientes(prev => [nuevoRegistro, ...prev.slice(0, 9)]);

      showSuccess(`Tiempo registrado: ${participante.nombre} ${participante.apellidos}`);
      
      return true;

    } catch (error) {
      showError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    etapaSeleccionada, dorsal, tiempo, participante, posicion, aplicarBonificacion,
    convertirTiempoAMs, formatearTiempo, etapas, showSuccess, showError
  ]);

  // Limpiar formulario
  const limpiarFormulario = useCallback(() => {
    setDorsal('');
    setTiempo('');
    setPosicion('');
    setParticipante(null);
  }, []);

  // Cargar etapas al inicializar
  useEffect(() => {
    cargarEtapas();
  }, [cargarEtapas]);

  return {
    // Estados
    etapas,
    etapaSeleccionada,
    setEtapaSeleccionada,
    dorsal,
    setDorsal,
    tiempo,
    setTiempo,
    posicion,
    setPosicion,
    aplicarBonificacion,
    setAplicarBonificacion,
    loading,
    participante,
    tiemposRecientes,
    
    // Funciones
    buscarParticipante,
    registrarTiempo,
    limpiarFormulario,
    formatearTiempo,
    convertirTiempoAMs,
    
    // Constantes
    bonificaciones
  };
};