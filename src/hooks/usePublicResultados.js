import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

export const usePublicResultados = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para formatear tiempo
  const formatTime = useCallback((timeMs) => {
    if (!timeMs || timeMs < 0) return '00:00.00';
    
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const centiseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  // Obtener categorías públicamente
  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Intentar endpoint público primero
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/api/public/categorias`);
      } catch (publicError) {
        // Fallback a endpoint privado (sin autenticación)
        response = await axios.get(`${API_BASE_URL}/api/inscripciones/categorias`);
      }
      
      return {
        success: true,
        data: response.data.categorias || []
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error cargando categorías';
      setError(errorMessage);
      console.error('Error cargando categorías:', error);
      return {
        success: false,
        error: errorMessage,
        data: []
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener etapas públicamente
  const fetchEtapas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Intentar endpoint público primero
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/api/public/etapas`);
      } catch (publicError) {
        // Fallback a endpoint privado (sin autenticación)
        response = await axios.get(`${API_BASE_URL}/api/tiempos/etapas`);
      }
      
      return {
        success: true,
        data: response.data.etapas || []
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error cargando etapas';
      setError(errorMessage);
      console.error('Error cargando etapas:', error);
      return {
        success: false,
        error: errorMessage,
        data: []
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener tiempos por etapa públicamente
  const fetchTiemposByEtapa = useCallback(async (etapaId) => {
    if (!etapaId) return { success: false, error: 'ID de etapa requerido', data: [] };
    
    setLoading(true);
    setError(null);
    
    try {
      // Intentar endpoint público primero
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/api/public/etapas/${etapaId}/tiempos`);
      } catch (publicError) {
        // Fallback a endpoint privado
        response = await axios.get(`${API_BASE_URL}/api/tiempos/etapas/${etapaId}/tiempos`);
      }
      
      return {
        success: true,
        data: response.data.tiempos || []
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error cargando tiempos';
      setError(errorMessage);
      console.error('Error cargando tiempos:', error);
      return {
        success: false,
        error: errorMessage,
        data: []
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estadísticas de etapa públicamente
  const fetchEstadisticasEtapa = useCallback(async (etapaId) => {
    if (!etapaId) return { success: false, error: 'ID de etapa requerido', data: null };
    
    setLoading(true);
    setError(null);
    
    try {
      // Intentar endpoint público primero
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/api/public/etapas/${etapaId}/estadisticas`);
      } catch (publicError) {
        // Fallback a endpoint privado
        response = await axios.get(`${API_BASE_URL}/api/tiempos/etapas/${etapaId}/estadisticas`);
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error cargando estadísticas';
      setError(errorMessage);
      console.error('Error cargando estadísticas:', error);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener clasificación general públicamente
  const fetchClasificacion = useCallback(async (categoriaId) => {
    if (!categoriaId) return { success: false, error: 'ID de categoría requerido', data: [] };
    
    setLoading(true);
    setError(null);
    
    try {
      // Intentar endpoint público primero
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/api/public/clasificacion/${categoriaId}`);
      } catch (publicError) {
        // Fallback a endpoint privado
        response = await axios.get(`${API_BASE_URL}/api/tiempos/clasificacion/${categoriaId}`);
      }
      
      return {
        success: true,
        data: response.data.clasificacion || []
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error cargando clasificación';
      setError(errorMessage);
      console.error('Error cargando clasificación:', error);
      return {
        success: false,
        error: errorMessage,
        data: []
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener resumen rápido de resultados (útil para mostrar en home)
  const fetchResumenResultados = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Intentar obtener un resumen general
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/api/public/resumen-resultados`);
      } catch (publicError) {
        // Si no existe, crear resumen básico obteniendo datos disponibles
        const categoriasResult = await fetchCategorias();
        const etapasResult = await fetchEtapas();
        
        return {
          success: true,
          data: {
            total_categorias: categoriasResult.data?.length || 0,
            total_etapas: etapasResult.data?.length || 0,
            hay_resultados: (categoriasResult.data?.length || 0) > 0 && (etapasResult.data?.length || 0) > 0
          }
        };
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error cargando resumen';
      setError(errorMessage);
      console.error('Error cargando resumen:', error);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    } finally {
      setLoading(false);
    }
  }, [fetchCategorias, fetchEtapas]);

  // Verificar si hay resultados disponibles
  const checkResultadosDisponibles = useCallback(async () => {
    try {
      const resumen = await fetchResumenResultados();
      return resumen.success && resumen.data?.hay_resultados;
    } catch (error) {
      console.error('Error verificando disponibilidad de resultados:', error);
      return false;
    }
  }, [fetchResumenResultados]);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    loading,
    error,
    
    // Funciones principales
    fetchCategorias,
    fetchEtapas,
    fetchTiemposByEtapa,
    fetchEstadisticasEtapa,
    fetchClasificacion,
    fetchResumenResultados,
    checkResultadosDisponibles,
    
    // Utilidades
    formatTime,
    clearError
  };
};