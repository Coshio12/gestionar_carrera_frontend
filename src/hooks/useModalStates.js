import { useState, useCallback } from "react";

export const useModalStates = () => {
  // Estados para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParticipante, setSelectedParticipante] = useState(null);
  
  // Estados para el modal de comprobante
  const [showComprobanteModal, setShowComprobanteModal] = useState(false);
  const [selectedComprobante, setSelectedComprobante] = useState(null);
  const [selectedParticipanteName, setSelectedParticipanteName] = useState('');

  // Estados para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [participanteToDelete, setParticipanteToDelete] = useState(null);

  // Handlers para modal de edición
  const openEditModal = useCallback((participante) => {
    setSelectedParticipante(participante);
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedParticipante(null);
  }, []);

  // Handlers para modal de eliminación
  const openDeleteModal = useCallback((participante) => {
    setParticipanteToDelete(participante);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setParticipanteToDelete(null);
  }, []);

  // Handlers para modal de comprobante
  const openComprobanteModal = useCallback((comprobantePath, participanteName) => {
    setSelectedComprobante(comprobantePath);
    setSelectedParticipanteName(participanteName);
    setShowComprobanteModal(true);
  }, []);

  const closeComprobanteModal = useCallback(() => {
    setShowComprobanteModal(false);
    setSelectedComprobante(null);
    setSelectedParticipanteName('');
  }, []);

  return {
    // Estados
    showEditModal,
    selectedParticipante,
    showComprobanteModal,
    selectedComprobante,
    selectedParticipanteName,
    showDeleteModal,
    participanteToDelete,
    
    // Handlers
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openComprobanteModal,
    closeComprobanteModal,
  };
};