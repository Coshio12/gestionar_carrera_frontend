import { useEffect, useState, useCallback, useRef } from "react";
import { useToast } from "../context/ToastContext";
import { useParticipantsApi } from "../hooks/useParticipantsApi";
import { useModalStates } from "../hooks/useModalStates";
import { usePagination } from "../hooks/usePagination";
import { useParticipantSearch } from "../hooks/useParticipantSearch";

export const useListaInscritosLogic = () => {
  // Estados principales
  const [categorias, setCategorias] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Ref para evitar cargas duplicadas
  const isLoadingRef = useRef(false);
  const lastLoadedCategoryRef = useRef(null);

  const { showSuccess, showError } = useToast();

  // Hooks personalizados - IMPORTANTE: asegurar que no cambien en cada render
  const api = useParticipantsApi({
    showError,
    showSuccess,
  });

  const modalStates = useModalStates();
  const { searchTerm, setSearchTerm, filteredParticipants } = useParticipantSearch(participants);

  const itemsPerPage = 6;
  const { currentPage, setCurrentPage, totalPages, paginatedItems: paginatedParticipants } = usePagination(
    filteredParticipants,
    itemsPerPage
  );

  // Función estable para cargar participantes
  const loadParticipants = useCallback(async (categoriaId) => {
    // Evitar cargas duplicadas
    if (isLoadingRef.current || !categoriaId) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    
    try {
      const participantsData = await api.fetchParticipants(categoriaId);
      setParticipants(participantsData || []);
      lastLoadedCategoryRef.current = categoriaId;
    } catch (error) {
      console.error('Error loading participants:', error);
      setParticipants([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [api.fetchParticipants]);

  // Cargar datos iniciales SOLO una vez
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (!isMounted) return;
      
      setLoadingCategorias(true);
      try {
        const [categoriasData, equiposData] = await Promise.all([
          api.fetchCategorias(),
          api.fetchEquipos(),
        ]);

        if (!isMounted) return;

        setCategorias(categoriasData || []);
        setEquipos(equiposData || []);
        
        // Solo establecer categoría activa si no hay una y hay categorías disponibles
        if (categoriasData && categoriasData.length > 0) {
          setCategoriaActiva(categoriasData[0]);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading initial data:', error);
        }
      } finally {
        if (isMounted) {
          setLoadingCategorias(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []); // SIN dependencias - solo cargar una vez

  // Cargar participantes cuando cambia la categoría activa
  useEffect(() => {
    if (categoriaActiva && categoriaActiva.id !== lastLoadedCategoryRef.current) {
      loadParticipants(categoriaActiva.id);
      setCurrentPage(1);
      setSearchTerm('');
    }
  }, [categoriaActiva?.id, loadParticipants, setCurrentPage, setSearchTerm]);

  // Resetear página al filtrar - con debounce para evitar renders excesivos
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
    }, 100);

    return () => clearTimeout(timeout);
  }, [searchTerm, setCurrentPage]);

  // Handlers estables
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleEditClick = useCallback((participante) => {
    modalStates.openEditModal(participante);
  }, [modalStates]);

  const handleDeleteClick = useCallback((participante) => {
    modalStates.openDeleteModal(participante);
  }, [modalStates]);

  const handleConfirmDelete = useCallback(async () => {
    const participanteToDelete = modalStates.participanteToDelete;
    
    if (!participanteToDelete) {
      return;
    }

    setDeleteLoading(true);
    
    try {
      // Llamar al API para eliminar
      await api.deleteParticipant(participanteToDelete.id);
      
      // Actualizar estado local INMEDIATAMENTE
      setParticipants(prevParticipants => {
        const newParticipants = prevParticipants.filter(p => p.id !== participanteToDelete.id);
        return newParticipants;
      });
      
      // Cerrar modal
      modalStates.closeDeleteModal();
      
      // Mostrar mensaje de éxito
      showSuccess(
        `Participante ${participanteToDelete.nombre} ${participanteToDelete.apellidos} eliminado correctamente`
      );

      // Ajustar paginación si es necesario
      setTimeout(() => {
        const currentFilteredCount = participants.filter(p => p.id !== participanteToDelete.id).length;
        const newTotalPages = Math.ceil(currentFilteredCount / itemsPerPage);
        
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error eliminando participante:', error);
      const errorMessage = error?.message || error?.response?.data?.error || 'Error eliminando participante';
      showError(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  }, [modalStates, api.deleteParticipant, showSuccess, showError, participants, currentPage, itemsPerPage, setCurrentPage]);

  const handleViewComprobante = useCallback((participante) => {
    if (participante.comprobante_url) {
      modalStates.openComprobanteModal(
        participante.comprobante_url,
        `${participante.nombre} ${participante.apellidos}`
      );
    }
  }, [modalStates]);

  const handleCloseModal = useCallback(() => {
    modalStates.closeEditModal();
  }, [modalStates]);

  const handleCloseDeleteModal = useCallback(() => {
    modalStates.closeDeleteModal();
  }, [modalStates]);

  const handleCloseComprobanteModal = useCallback(() => {
    modalStates.closeComprobanteModal();
  }, [modalStates]);

  const handleParticipanteUpdated = useCallback((updatedParticipante) => {
    
    // Verificar si el participante actualizado pertenece a la categoría actual
    if (updatedParticipante.categoria_id === categoriaActiva?.id) {
      // Actualizar el participante en la lista local
      setParticipants(prev => {
        const updated = prev.map(p => 
          p.id === updatedParticipante.id 
            ? { ...p, ...updatedParticipante }
            : p
        );
        return updated;
      });
    } else {
      // Si cambió de categoría, removerlo de la lista actual
      setParticipants(prev => {
        const filtered = prev.filter(p => p.id !== updatedParticipante.id);
        return filtered;
      });
    }
    
    // Cerrar el modal
    modalStates.closeEditModal();
    
    // Mostrar mensaje de éxito
    showSuccess('Participante actualizado correctamente');
  }, [categoriaActiva?.id, modalStates, showSuccess]);

  const handlePrev = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, [setCurrentPage]);

  const handleNext = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [setCurrentPage, totalPages]);

  const handleSetCategoriaActiva = useCallback((categoria) => {
    if (categoria?.id !== categoriaActiva?.id) {
      setCategoriaActiva(categoria);
    }
  }, [categoriaActiva?.id]);

  // Función para refrescar datos manualmente
  const refreshData = useCallback(() => {
    if (categoriaActiva?.id) {
      loadParticipants(categoriaActiva.id);
    }
  }, [categoriaActiva?.id, loadParticipants]);

  return {
    // Estados de datos
    categorias,
    equipos,
    categoriaActiva,
    setCategoriaActiva: handleSetCategoriaActiva,
    participants,
    filteredParticipants,
    
    // Estados de carga
    loading,
    loadingCategorias,
    deleteLoading,
    
    // Estados de búsqueda y paginación
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedParticipants,
    
    // Estados de modales
    modalStates,
    
    // Handlers
    handleSearchChange,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleViewComprobante,
    handleCloseModal,
    handleCloseDeleteModal,
    handleCloseComprobanteModal,
    handleParticipanteUpdated,
    handlePrev,
    handleNext,
    
    // Función para refrescar datos manualmente
    refreshData,
  };
};