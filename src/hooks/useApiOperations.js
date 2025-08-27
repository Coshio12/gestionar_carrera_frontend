import { useCallback } from "react";

const API_BASE_URL = "http://localhost:5000";

export const useApiOperations = ({
  etapas,
  setEtapas,
  categorias,
  setCategorias,
  participantes,
  setParticipantes,
  markDataUpdated,
  showError,
  setEtapaActiva,
  etapaActiva,
}) => {
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  const fetchEtapas = useCallback(
    async (forceRefresh = false) => {
      try {
        if (!forceRefresh && etapas.length > 0) {
          return etapas;
        }

        const response = await fetch(`${API_BASE_URL}/api/tiempos/etapas`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const etapasData = data.etapas || [];
        
        setEtapas(etapasData);
        markDataUpdated();

        // Si no hay etapa activa y hay etapas disponibles, seleccionar la primera
        if (!etapaActiva && etapasData.length > 0) {
          setEtapaActiva(etapasData[0]);
        }

        return etapasData;
      } catch (error) {
        console.error("Error cargando etapas:", error);
        showError(`Error cargando etapas: ${error.message}`);
        return [];
      }
    },
    [etapas, getAuthHeaders, setEtapas, markDataUpdated, etapaActiva, setEtapaActiva, showError]
  );

  const fetchCategorias = useCallback(
    async (forceRefresh = false) => {
      try {
        if (!forceRefresh && categorias.length > 0) {
          return categorias;
        }

        const response = await fetch(`${API_BASE_URL}/api/tiempos/categorias`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const categoriasData = data.categorias || [];
        
        setCategorias(categoriasData);
        markDataUpdated();

        return categoriasData;
      } catch (error) {
        console.error("Error cargando categorías:", error);
        showError(`Error cargando categorías: ${error.message}`);
        return [];
      }
    },
    [categorias, getAuthHeaders, setCategorias, markDataUpdated, showError]
  );

  const fetchParticipantes = useCallback(
    async (forceRefresh = false) => {
      try {
        if (!forceRefresh && participantes.length > 0) {
          return participantes;
        }

        const response = await fetch(`${API_BASE_URL}/api/tiempos/participantes`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const participantesData = data.participantes || [];
        
        setParticipantes(participantesData);
        markDataUpdated();

        return participantesData;
      } catch (error) {
        console.error("Error cargando participantes:", error);
        showError(`Error cargando participantes: ${error.message}`);
        return [];
      }
    },
    [participantes, getAuthHeaders, setParticipantes, markDataUpdated, showError]
  );

  const fetchHoraSalidaBase = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tiempos/hora-salida-base`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.hora_salida_base;
    } catch (error) {
      console.error("Error cargando hora de salida base:", error);
      showError(`Error cargando hora de salida base: ${error.message}`);
      return null;
    }
  }, [getAuthHeaders, showError]);

  return {
    fetchEtapas,
    fetchCategorias,
    fetchParticipantes,
    fetchHoraSalidaBase,
  };
};