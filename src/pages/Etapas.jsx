import React, { useState } from "react";
import { useEtapas } from "../hooks/useEtapas";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import EtapaForm from "../components/Etapas/EtapaForm";
import EtapaTable from "../components/Etapas/EtapaTable";

export default function Etapas() {
  const { etapas, loading, createEtapa, updateEtapa, deleteEtapa, refetch } =
    useEtapas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingEtapa, setEditingEtapa] = useState(null);
  const [etapaToDelete, setEtapaToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Abrir modal para crear nueva etapa
  const handleCreateClick = () => {
    setEditingEtapa(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar etapa
  const handleEditClick = (etapa) => {
    setEditingEtapa(etapa);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEtapa(null);
  };

  // Manejar envío del formulario
  const handleFormSubmit = async (formData) => {
    setActionLoading(true);

    let result;
    if (editingEtapa) {
      result = await updateEtapa(editingEtapa.id, formData);
    } else {
      result = await createEtapa(formData);
    }

    setActionLoading(false);

    if (result.success) {
      handleCloseModal();
    }
  };

  // Abrir modal de confirmación para eliminar
  const handleDeleteClick = (etapa) => {
    setEtapaToDelete(etapa);
    setIsConfirmModalOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!etapaToDelete) return;

    setActionLoading(true);
    const result = await deleteEtapa(etapaToDelete.id);
    setActionLoading(false);

    if (result.success) {
      setIsConfirmModalOpen(false);
      setEtapaToDelete(null);
    }
  };

  // Cerrar modal de confirmación
  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setEtapaToDelete(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-10 animate-fade-in bg-gray-100 lg:ml-0">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-lime-500 mb-3 sm:mb-4">
              Gestión de Etapas
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Administra las etapas de las competencias por categoría
            </p>
            <button
              onClick={handleCreateClick}
              className="w-full sm:w-auto bg-lime-500 text-white font-bold py-2 px-4 rounded hover:bg-lime-700 transition mb-4 sm:mb-6 inline-flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm sm:text-base">Crear Etapa</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && etapas.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-lime-600"></div>
            <span className="ml-2 text-sm sm:text-base text-gray-600">Cargando etapas...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && etapas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow px-4">
            <svg
              className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay etapas registradas
            </h3>
            <p className="mt-1 text-sm text-gray-500 px-4">
              Comienza creando tu primera etapa.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateClick}
                className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Crear Primera Etapa
              </button>
            </div>
          </div>
        )}

        {/* Tabla de etapas */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <EtapaTable
            etapas={etapas}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          {/* Información adicional */}
          {etapas.length > 0 && (
            <div className="mt-4 bg-white rounded-lg shadow p-3 sm:p-4 border-t border-b border-gray-600">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="text-center sm:text-left">
                  Total de etapas:{" "}
                  <span className="font-medium text-gray-900">
                    {etapas.length}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  Etapas activas:{" "}
                  <span className="font-medium text-green-600">
                    {etapas.filter((e) => e.activa).length}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  Etapas inactivas:{" "}
                  <span className="font-medium text-red-600">
                    {etapas.filter((e) => !e.activa).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal para crear/editar etapa */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingEtapa ? "Editar Etapa" : "Crear Nueva Etapa"}
          size="lg"
        >
          <EtapaForm
            onSubmit={handleFormSubmit}
            initialData={editingEtapa}
            loading={actionLoading}
            onCancel={handleCloseModal}
          />
        </Modal>

        {/* Modal de confirmación para eliminar */}
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
          message={`¿Está seguro que desea eliminar la etapa "${etapaToDelete?.nombre}" (Etapa ${etapaToDelete?.numero_etapa})? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
          loading={actionLoading}
        />
      </div>
    </div>
  );
}