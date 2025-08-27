import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

export const useEtapas = () => {
  const [etapas, setEtapas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToast();

  // Obtener token del localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Headers para requests autenticados
  const getAuthHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Obtener todas las etapas
  const fetchEtapas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/etapas`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEtapas(data);
    } catch (err) {
      setError(err.message);
      showError('Error al cargar las etapas');
      console.error('Error fetching etapas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva etapa
  const createEtapa = async (etapaData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/etapas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(etapaData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la etapa');
      }

      // Actualizar la lista local
      setEtapas(prev => [data.etapa, ...prev]);
      showSuccess(data.message || 'Etapa creada con éxito');
      
      return { success: true, data: data.etapa };
    } catch (err) {
      setError(err.message);
      showError(err.message);
      console.error('Error creating etapa:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar etapa
  const updateEtapa = async (id, etapaData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/etapas/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(etapaData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar la etapa');
      }

      // Actualizar la lista local
      setEtapas(prev => 
        prev.map(etapa => 
          etapa.id === id ? data.etapa : etapa
        )
      );
      
      showSuccess(data.message || 'Etapa actualizada con éxito');
      return { success: true, data: data.etapa };
    } catch (err) {
      setError(err.message);
      showError(err.message);
      console.error('Error updating etapa:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar etapa
  const deleteEtapa = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/etapas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar la etapa');
      }

      // Actualizar la lista local
      setEtapas(prev => prev.filter(etapa => etapa.id !== id));
      showSuccess(data.message || 'Etapa eliminada con éxito');
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      showError(err.message);
      console.error('Error deleting etapa:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Obtener etapa por ID
  const getEtapaById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/etapas/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      showError('Error al cargar la etapa');
      console.error('Error fetching etapa:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Cargar etapas al montar el componente
  useEffect(() => {
    fetchEtapas();
  }, []);

  return {
    etapas,
    loading,
    error,
    fetchEtapas,
    createEtapa,
    updateEtapa,
    deleteEtapa,
    getEtapaById,
    refetch: fetchEtapas
  };
};