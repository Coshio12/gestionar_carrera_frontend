import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = 'http://localhost:5000';

export const useListaTiempos = () => {
  const [tiempos, setTiempos] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalTiempos: 0,
    totalParticipantes: 0,
    tiempoPorEtapa: [],
    tiempoPorCategoria: []
  });

  const [filtros, setFiltros] = useState({
    etapaId: '',
    categoriaId: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  const { showSuccess, showError, showInfo } = useToast();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Fetch tiempos con filtros
  const fetchTiempos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filtros.etapaId) params.append('etapa_id', filtros.etapaId);
      if (filtros.categoriaId) params.append('categoria_id', filtros.categoriaId);
      if (filtros.fechaDesde) params.append('fecha_desde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.append('fecha_hasta', filtros.fechaHasta);

      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/lista?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      setTiempos(response.data.tiempos || []);
      
      // Calcular estadísticas
      calcularEstadisticas(response.data.tiempos || []);
    } catch (error) {
      console.error('Error cargando tiempos:', error);
      showError('Error cargando tiempos');
      setTiempos([]);
    } finally {
      setLoading(false);
    }
  }, [filtros, showError]);

  // Fetch etapas
  const fetchEtapas = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/etapas`,
        { headers: getAuthHeaders() }
      );
      setEtapas(response.data.etapas || []);
    } catch (error) {
      console.error('Error cargando etapas:', error);
      showError('Error cargando etapas');
    }
  }, [showError]);

  // Fetch categorías
  const fetchCategorias = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/inscripciones/categorias`,
        { headers: getAuthHeaders() }
      );
      setCategorias(response.data.categorias || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      showError('Error cargando categorías');
    }
  }, [showError]);

  // Fetch participantes
  const fetchParticipantes = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/inscripciones/participantes`,
        { headers: getAuthHeaders() }
      );
      setParticipantes(response.data.participantes || []);
    } catch (error) {
      console.error('Error cargando participantes:', error);
      showError('Error cargando participantes');
    }
  }, [showError]);

  // Actualizar tiempo
  const updateTiempo = useCallback(async (tiempoId, tiempoData) => {
    try {
      setLoading(true);
      
      console.log('=== ACTUALIZANDO TIEMPO ===');
      console.log('Tiempo ID:', tiempoId);
      console.log('Tipo de ID:', typeof tiempoId);
      console.log('Datos a enviar:', tiempoData);
      
      // Validaciones previas
      if (!tiempoId) {
        throw new Error('ID del tiempo es requerido para la actualización');
      }

      if (!tiempoData || Object.keys(tiempoData).length === 0) {
        throw new Error('No se proporcionaron datos para actualizar');
      }

      // Validar que al menos el tiempo esté presente
      if (!tiempoData.tiempo || tiempoData.tiempo <= 0) {
        throw new Error('El tiempo debe ser un valor válido mayor a 0');
      }

      // Preparar datos con valores por defecto
      // IMPORTANTE: Excluir campos que no se pueden actualizar directamente
      const dataToSend = {
        tiempo: tiempoData.tiempo,
        penalizacion: tiempoData.penalizacion || 0,
        observaciones: tiempoData.observaciones || null,
        // Solo incluir participante_id y etapa_id si se proporcionan
        ...(tiempoData.participante_id && { participante_id: tiempoData.participante_id }),
        ...(tiempoData.etapa_id && { etapa_id: tiempoData.etapa_id })
      };

      // CRÍTICO: NO incluir campos calculados o generados automáticamente
      // Estos campos se calculan en la base de datos:
      // - tiempo_final (columna generada automáticamente)
      // - updated_at (se actualiza automáticamente)
      // - created_at (no se debe modificar)

      console.log('Datos finales a enviar (sin campos generados):', dataToSend);
      console.log('URL de la petición:', `${API_BASE_URL}/api/tiempos/tiempos/${tiempoId}`);
      
      const response = await axios.put(
        `${API_BASE_URL}/api/tiempos/tiempos/${tiempoId}`,
        dataToSend,
        { 
          headers: getAuthHeaders(),
          timeout: 30000 // Timeout de 30 segundos
        }
      );

      console.log('Respuesta del servidor:', response.data);

      // Verificar que la respuesta sea exitosa
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.error || 'La actualización no fue exitosa');
      }

      showSuccess('Tiempo actualizado correctamente');
      
      return { 
        success: true, 
        data: response.data.tiempo,
        message: response.data.message 
      };

    } catch (error) {
      console.error('=== ERROR EN UPDATE TIEMPO ===');
      console.error('Error completo:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      let errorMessage = 'Error actualizando tiempo';
      
      // Manejo específico de errores
      if (error.response) {
        // Error del servidor
        const status = error.response.status;
        const serverError = error.response.data;
        
        console.log('Error del servidor:', serverError);
        
        switch (status) {
          case 400:
            errorMessage = serverError?.error || 'Datos inválidos para la actualización';
            break;
          case 401:
            errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente';
            break;
          case 404:
            errorMessage = 'El tiempo no fue encontrado. Es posible que haya sido eliminado';
            break;
          case 500:
            errorMessage = serverError?.error || 'Error interno del servidor';
            break;
          default:
            errorMessage = serverError?.error || `Error del servidor (${status})`;
        }
      } else if (error.request) {
        // Error de red
        console.error('Error de red:', error.request);
        errorMessage = 'Error de conexión. Verifique su conexión a internet';
      } else {
        // Error de configuración
        errorMessage = error.message || 'Error inesperado';
      }
      
      showError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage,
        details: error.response?.data || error.message
      };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  
  // Función para manejar la edición
  const handleSaveEdit = async (tiempoData, tiempoSeleccionado) => {
    try {
      console.log('=== GUARDANDO EDICIÓN ===');
      console.log('Tiempo seleccionado:', tiempoSeleccionado);
      console.log('Datos del formulario:', tiempoData);
      
      // Validar que tengamos un tiempo seleccionado
      if (!tiempoSeleccionado) {
        throw new Error('No se ha seleccionado un tiempo para editar');
      }

      if (!tiempoSeleccionado.id) {
        throw new Error('El tiempo seleccionado no tiene un ID válido');
      }

      const result = await updateTiempo(tiempoSeleccionado.id, tiempoData);
      
      if (result.success) {
        // Recargar los datos para mostrar los cambios
        await fetchTiempos();
        console.log('Tiempo actualizado exitosamente');
      } else {
        console.error('Error en la actualización:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error en handleSaveEdit:', error);
      const errorMessage = error.message || 'Error inesperado al guardar';
      showError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Función para debug
  const debugTiempo = useCallback(async (tiempoId) => {
    try {
      console.log('=== DEBUG TIEMPO ===');
      const response = await axios.get(
        `${API_BASE_URL}/api/tiempos/debug-tiempo/${tiempoId}`,
        { headers: getAuthHeaders() }
      );
      
      console.log('Debug info:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en debug:', error);
      return null;
    }
  }, []);

  // Función auxiliar para validar el formato de tiempo
  const validateTimeFormat = (tiempo) => {
    const tiempoNum = parseInt(tiempo);
    return !isNaN(tiempoNum) && tiempoNum > 0;
  };

  // Función auxiliar para formatear datos antes de enviar
  const prepareTimeData = (rawData) => {
    const prepared = {
      tiempo: parseInt(rawData.tiempo),
      penalizacion: rawData.penalizacion ? parseInt(rawData.penalizacion) : 0,
      observaciones: rawData.observaciones || null
    };

    // Solo incluir IDs si están presentes y son válidos
    if (rawData.participante_id) {
      prepared.participante_id = rawData.participante_id;
    }
    
    if (rawData.etapa_id) {
      prepared.etapa_id = parseInt(rawData.etapa_id);
    }

    // IMPORTANTE: No incluir campos calculados automáticamente
    // No incluir: tiempo_final, updated_at, created_at

    return prepared;
  };

  // Eliminar tiempo
  const deleteTiempo = useCallback(async (tiempoId) => {
    try {
      setLoading(true);
      await axios.delete(
        `${API_BASE_URL}/api/tiempos/tiempos/${tiempoId}`,
        { headers: getAuthHeaders() }
      );

      showSuccess('Tiempo eliminado correctamente');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error eliminando tiempo';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  // Calcular estadísticas
  const calcularEstadisticas = useCallback((tiemposData) => {
    const participantesUnicos = new Set(tiemposData.map(t => t.participante_id));
    
    // Tiempos por etapa
    const tiempoPorEtapa = {};
    tiemposData.forEach(tiempo => {
      const etapaId = tiempo.etapa_id;
      if (!tiempoPorEtapa[etapaId]) {
        tiempoPorEtapa[etapaId] = {
          count: 0,
          etapa: tiempo.etapas?.nombre || `Etapa ${tiempo.etapa_id}`
        };
      }
      tiempoPorEtapa[etapaId].count++;
    });

    // Tiempos por categoría
    const tiempoPorCategoria = {};
    tiemposData.forEach(tiempo => {
      const categoriaId = tiempo.participantes?.categoria_id;
      if (categoriaId) {
        if (!tiempoPorCategoria[categoriaId]) {
          tiempoPorCategoria[categoriaId] = {
            count: 0,
            categoria: tiempo.participantes?.categorias?.nombre || 'Sin categoría'
          };
        }
        tiempoPorCategoria[categoriaId].count++;
      }
    });

    setEstadisticas({
      totalTiempos: tiemposData.length,
      totalParticipantes: participantesUnicos.size,
      tiempoPorEtapa: Object.values(tiempoPorEtapa),
      tiempoPorCategoria: Object.values(tiempoPorCategoria)
    });
  }, []);

  // Actualizar filtros
  const updateFiltros = useCallback((nuevosFiltros) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
  }, []);

  // Refrescar todos los datos
  const refreshData = useCallback(async () => {
    showInfo('Actualizando datos...');
    await Promise.all([
      fetchTiempos(),
      fetchEtapas(),
      fetchCategorias(),
      fetchParticipantes()
    ]);
  }, [fetchTiempos, fetchEtapas, fetchCategorias, fetchParticipantes, showInfo]);

  // Utilidades
  const formatTime = useCallback((timeMs) => {
    if (!timeMs || timeMs < 0) return '00:00.00';
    
    const hours = Math.floor(timeMs / 3600000);
    const minutes = Math.floor((timeMs % 3600000) / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const centiseconds = Math.floor((timeMs % 1000) / 10);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  const parseTimeString = useCallback((timeString) => {
    if (!timeString) return 0;
    
    // Formato: HH:MM:SS.CC o MM:SS.CC
    const parts = timeString.split(':');
    let hours = 0, minutes = 0, seconds = 0, centiseconds = 0;
    
    if (parts.length === 3) {
      // HH:MM:SS.CC
      hours = parseInt(parts[0]) || 0;
      minutes = parseInt(parts[1]) || 0;
      const secondsParts = parts[2].split('.');
      seconds = parseInt(secondsParts[0]) || 0;
      centiseconds = parseInt(secondsParts[1]) || 0;
    } else if (parts.length === 2) {
      // MM:SS.CC
      minutes = parseInt(parts[0]) || 0;
      const secondsParts = parts[1].split('.');
      seconds = parseInt(secondsParts[0]) || 0;
      centiseconds = parseInt(secondsParts[1]) || 0;
    }
    
    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + (centiseconds * 10);
  }, []);

  // Efectos
  useEffect(() => {
    fetchEtapas();
    fetchCategorias();
    fetchParticipantes();
  }, [fetchEtapas, fetchCategorias, fetchParticipantes]);

  useEffect(() => {
    fetchTiempos();
  }, [fetchTiempos]);

  return {
    // Estados
    tiempos,
    etapas,
    categorias,
    participantes,
    loading,
    filtros,
    estadisticas,
    
    // Funciones
    updateFiltros,
    fetchTiempos,
    updateTiempo,
    deleteTiempo,
    refreshData,
    handleSaveEdit,
    
    // Utilidades
    formatTime,
    parseTimeString,
    validateTimeFormat,
    prepareTimeData,
    debugTiempo
  };
};