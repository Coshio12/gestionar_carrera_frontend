import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const API_URL = import.meta.env.VITE_API_URL;

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useToast();

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

  // Obtener todas las categorías
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/categorias`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Manejar diferentes estructuras de respuesta
      let categorias = [];
      
      if (Array.isArray(responseData)) {
        // Respuesta directa como array
        categorias = responseData;
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
        // Respuesta con estructura {success: true, data: []}
        categorias = responseData.data;
      } else if (responseData && responseData.success && responseData.data && Array.isArray(responseData.data)) {
        // Respuesta con estructura completa {success: true, data: []}
        categorias = responseData.data;
      } else {
        console.error('Estructura de respuesta no reconocida:', responseData);
        categorias = [];
        showError('Error: Estructura de respuesta inválida del servidor');
      }
      
      setCategorias(categorias);
    } catch (err) {
      setError(err.message);
      setCategorias([]); // Asegurar que categorias sea siempre un array
      showError('Error al cargar las categorías');
      console.error('Error fetching categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias: Array.isArray(categorias) ? categorias : [], // Doble verificación
    loading,
    error,
    fetchCategorias,
    refetch: fetchCategorias
  };
};