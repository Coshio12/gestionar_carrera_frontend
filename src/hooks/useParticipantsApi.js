import { useCallback } from "react";
import axios from 'axios';
import { supabase } from "../supabase/client";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

export const useParticipantsApi = ({ showError, showSuccess }) => {
  
  const fetchCategorias = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_BASE_URL}/api/inscripciones/categorias`, { headers });
      return response.data.categorias || [];
    } catch (error) {
      console.error("Error fetching categorias:", error);
      showError('Error cargando categorías');
      return [];
    }
  }, [showError]);

  const fetchEquipos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_BASE_URL}/api/inscripciones/equipos`, { headers });
      return response.data.equipos || [];
    } catch (error) {
      console.error("Error fetching equipos:", error);
      showError('Error cargando equipos');
      return [];
    }
  }, [showError]);

  const fetchParticipants = useCallback(async (categoriaId) => {
  const { data, error } = await supabase
    .from("participantes")
    .select(`
      id, 
      nombre, 
      apellidos, 
      ci, 
      dorsal, 
      categoria_id, 
      equipo, 
      metodo_pago, 
      comprobante_url,
      comunidad,
      foto_anverso_url,
      foto_reverso_url,
      fecha_nacimiento,
      autorizacion_url
    `)
    .eq("categoria_id", categoriaId)
    .order("dorsal", { ascending: true, nullsLast: true });

  if (error) {
    console.error("Error fetching participants:", error.message);
    showError('Error cargando participantes');
    return [];
  }
  
  return data || [];
}, [showError]);

  const deleteParticipant = useCallback(async (participantId) => {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(
      `${API_BASE_URL}/api/inscripciones/participantes/${participantId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  }, []);

  return {
    fetchCategorias,
    fetchEquipos,
    fetchParticipants,
    deleteParticipant,
  };
};