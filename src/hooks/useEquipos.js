import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useEquipos = () => {
  const [equipos, setEquipos] = useState([]);
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

  // Obtener todos los equipos
  const fetchEquipos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/equipos`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEquipos(data);
    } catch (err) {
      setError(err.message);
      showError('Error al cargar los equipos');
      console.error('Error fetching equipos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo equipo
  const createEquipo = async (equipoData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/equipos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(equipoData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el equipo');
      }

      // Actualizar la lista local
      setEquipos(prev => [data.equipo, ...prev]);
      showSuccess(data.message || 'Equipo creado con éxito');
      
      return { success: true, data: data.equipo };
    } catch (err) {
      setError(err.message);
      showError(err.message);
      console.error('Error creating equipo:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar equipo
  const updateEquipo = async (id, equipoData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/equipos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(equipoData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el equipo');
      }

      // Actualizar la lista local
      setEquipos(prev => 
        prev.map(equipo => 
          equipo.id === id ? data.equipo : equipo
        )
      );
      
      showSuccess(data.message || 'Equipo actualizado con éxito');
      return { success: true, data: data.equipo };
    } catch (err) {
      setError(err.message);
      showError(err.message);
      console.error('Error updating equipo:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar equipo
  const deleteEquipo = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/equipos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar el equipo');
      }

      // Actualizar la lista local
      setEquipos(prev => prev.filter(equipo => equipo.id !== id));
      showSuccess(data.message || 'Equipo eliminado con éxito');
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      showError(err.message);
      console.error('Error deleting equipo:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Obtener equipo por ID
  const getEquipoById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/equipos/${id}`, {
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
      showError('Error al cargar el equipo');
      console.error('Error fetching equipo:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Cargar equipos al montar el componente
  useEffect(() => {
    fetchEquipos();
  }, []);

  return {
    equipos,
    loading,
    error,
    fetchEquipos,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    getEquipoById,
    refetch: fetchEquipos
  };
};