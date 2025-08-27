import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = 'http://localhost:10000';

export const useTiempo = () => {
  const [etapas, setEtapas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiemposPorEtapa, setTiemposPorEtapa] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const { showSuccess, showError } = useToast();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Cargar etapas
  const fetchEtapas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/etapas`,
        { headers: getAuthHeaders() }
      );
      
      setEtapas(response.data.etapas || []);
    } catch (error) {
      console.error('Error cargando etapas:', error);
      showError('Error cargando etapas');
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías
  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/categorias`,
        { headers: getAuthHeaders() }
      );
      
      setCategorias(response.data.categorias || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      showError('Error cargando categorías');
    } finally {
      setLoading(false);
    }
  };

  // Cargar tiempos por etapa
  const fetchTiemposByEtapa = async (etapaId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/etapas/${etapaId}/tiempos`,
        { headers: getAuthHeaders() }
      );
      
      setTiemposPorEtapa(prev => ({
        ...prev,
        [etapaId]: response.data.tiempos || []
      }));
    } catch (error) {
      console.error('Error cargando tiempos:', error);
      showError('Error cargando tiempos de la etapa');
    } finally {
      setLoading(false);
    }
  };

  // Registrar nuevo tiempo
  const registrarTiempo = async (tiempoData) => {
    setSaving(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/tiempos/tiempos`,
        tiempoData,
        { headers: getAuthHeaders() }
      );

      // Actualizar cache local
      const etapaId = tiempoData.etapa_id;
      setTiemposPorEtapa(prev => ({
        ...prev,
        [etapaId]: [...(prev[etapaId] || []), response.data.tiempo]
      }));

      showSuccess('Tiempo registrado correctamente');
      return { success: true, data: response.data.tiempo };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error registrando tiempo';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  // Actualizar tiempo existente
  const updateTiempo = async (tiempoId, tiempoData) => {
    setSaving(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/tiempos/tiempos/${tiempoId}`,
        tiempoData,
        { headers: getAuthHeaders() }
      );

      // Actualizar cache local
      const updatedTiempo = response.data.tiempo;
      setTiemposPorEtapa(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(etapaId => {
          newData[etapaId] = newData[etapaId].map(tiempo => 
            tiempo.id === tiempoId ? updatedTiempo : tiempo
          );
        });
        return newData;
      });

      showSuccess('Tiempo actualizado correctamente');
      return { success: true, data: updatedTiempo };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error actualizando tiempo';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  // Eliminar tiempo
  const deleteTiempo = async (tiempoId) => {
    setSaving(true);
    try {
      await axios.delete(
        `${API_BASE_URL}/api/tiempos/tiempos/${tiempoId}`,
        { headers: getAuthHeaders() }
      );

      // Actualizar cache local
      setTiemposPorEtapa(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(etapaId => {
          newData[etapaId] = newData[etapaId].filter(tiempo => tiempo.id !== tiempoId);
        });
        return newData;
      });

      showSuccess('Tiempo eliminado correctamente');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error eliminando tiempo';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  // Obtener clasificación general
  const fetchClasificacion = async (categoriaId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/clasificacion/${categoriaId}`,
        { headers: getAuthHeaders() }
      );
      
      return { success: true, data: response.data.clasificacion };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error cargando clasificación';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas de etapa
  const fetchEstadisticasEtapa = async (etapaId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/etapas/${etapaId}/estadisticas`,
        { headers: getAuthHeaders() }
      );
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error cargando estadísticas';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Calcular ajuste de tiempo según categoría
  const calcularAjusteTiempo = (categoriaParticipante, tiempoOriginal, todasCategorias) => {
    if (!categoriaParticipante || !todasCategorias.length) return tiempoOriginal;

    // Obtener la categoría base (la primera que sale)
    const categoriaBase = todasCategorias.reduce((prev, current) => 
      (prev.hora_salida < current.hora_salida) ? prev : current
    );

    // Calcular diferencia en milisegundos
    const [horasBase, minutosBase, segundosBase] = categoriaBase.hora_salida.split(':').map(Number);
    const [horas, minutos, segundos] = categoriaParticipante.hora_salida.split(':').map(Number);

    const tiempoBaseEnMs = (horasBase * 3600 + minutosBase * 60 + (segundosBase || 0)) * 1000;
    const tiempoCategoriaEnMs = (horas * 3600 + minutos * 60 + (segundos || 0)) * 1000;

    const diferenciaMs = tiempoCategoriaEnMs - tiempoBaseEnMs;

    // El tiempo ajustado es el tiempo cronometrado menos la diferencia de salida
    return tiempoOriginal - diferenciaMs;
  };

  // Utilidades
  const formatTime = (timeMs) => {
    if (!timeMs || timeMs < 0) return '00:00.00';
    
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const centiseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const parseTimeString = (timeString) => {
    // Convierte formato "MM:SS.CC" a milisegundos
    const parts = timeString.split(':');
    if (parts.length !== 2) return 0;
    
    const minutes = parseInt(parts[0]) || 0;
    const secondsParts = parts[1].split('.');
    const seconds = parseInt(secondsParts[0]) || 0;
    const centiseconds = parseInt(secondsParts[1]) || 0;
    
    return (minutes * 60 * 1000) + (seconds * 1000) + (centiseconds * 10);
  };

  return {
    // Estados
    etapas,
    categorias,
    tiemposPorEtapa,
    loading,
    saving,
    
    // Funciones
    fetchEtapas,
    fetchCategorias,
    fetchTiemposByEtapa,
    registrarTiempo,
    updateTiempo,
    deleteTiempo,
    fetchClasificacion,
    fetchEstadisticasEtapa,
    
    // Utilidades
    formatTime,
    parseTimeString,
    calcularAjusteTiempo
  };
};