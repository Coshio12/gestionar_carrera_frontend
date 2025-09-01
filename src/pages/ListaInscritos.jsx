import React from "react";
import Sidebar from "../components/Sidebar";
import { useListaInscritosLogic } from "../hooks/useListaInscritosLogic";
import CategoryTabs from "../components/ListaInscritos/CategoryTabs";
import SearchBar from "../components/ListaInscritos/SearchBar";
import ParticipantsTable from "../components/ListaInscritos/ParticipantsTable";
import Pagination from "../components/ListaInscritos/Pagination";
import EditParticipanteModal from "../components/form/EditParticipanteModal";
import ComprobanteModal from "../components/ListaInscritos/ComprobanteModal";
import ConfirmDeleteModal from "../components/ListaInscritos/ConfirmDeleteModal";
import DocumentosModal from "../components/ListaInscritos/DocumentosModal";

export default function ListaInscritos() {
  const {
    // Estados de datos
    categorias,
    equipos,
    categoriaActiva,
    setCategoriaActiva,
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
    
    // Estados del modal de documentos
    documentModalState,

    // Handlers
    handleSearchChange,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleViewComprobante,
    handleViewDocumento,
    handleCloseModal,
    handleCloseDeleteModal,
    handleCloseComprobanteModal,
    handleCloseDocumentModal,
    handleParticipanteUpdated,
    handlePrev,
    handleNext,
  } = useListaInscritosLogic();

  // Loading state para categorías
  if (loadingCategorias) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:ml-0">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm sm:text-base text-gray-600">Cargando Datos...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 animate-fade-in bg-gray-100 lg:ml-0">
        {/* Header Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-lime-700">
            Participantes por Categoría
          </h1>
          
          {/* Tabs de Categoría */}
          <CategoryTabs
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            setCategoriaActiva={setCategoriaActiva}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
          {/* Buscador */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filteredCount={filteredParticipants.length}
          />

          {/* Loading state para participantes */}
          {loading && participants.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-lime-600"></div>
              <span className="ml-2 text-sm sm:text-base text-gray-600">
                Cargando participantes...
              </span>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredParticipants.length === 0 && (
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
                  d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 015.196-2.121M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm
                  ? "No se encontraron participantes"
                  : "No hay participantes registrados"}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 px-4 text-center">
                {searchTerm
                  ? `No hay participantes que coincidan con "${searchTerm}" en la categoría ${
                      categoriaActiva?.nombre || ""
                    }.`
                  : `No hay participantes registrados en la categoría ${
                      categoriaActiva?.nombre || ""
                    }.`}
              </p>
            </div>
          )}

          {/* Tabla de Participantes */}
          {!loading && filteredParticipants.length > 0 && (
            <ParticipantsTable
              loading={loading}
              participants={paginatedParticipants}
              filteredParticipants={filteredParticipants}
              searchTerm={searchTerm}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onViewComprobante={handleViewComprobante}
              onViewDocumento={handleViewDocumento}
            />
          )}

          {/* Paginación */}
          {!loading && filteredParticipants.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredParticipants.length}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}

          {/* Texto inferior */}
          {!loading && categoriaActiva && filteredParticipants.length > 0 && (
            <p className="mt-4 text-xs sm:text-sm text-gray-600 text-center">
              Lista de ciclistas en categoría{" "}
              <span className="font-semibold text-lime-700">
                {categoriaActiva.nombre.toUpperCase()}
              </span>
            </p>
          )}

          {/* Modales */}
          <EditParticipanteModal
            isOpen={modalStates.showEditModal}
            onClose={handleCloseModal}
            participante={modalStates.selectedParticipante}
            onParticipanteUpdated={handleParticipanteUpdated}
            categorias={categorias}
            equipos={equipos}
          />

          <ComprobanteModal
            isOpen={modalStates.showComprobanteModal}
            onClose={handleCloseComprobanteModal}
            comprobantePath={modalStates.selectedComprobante}
            participanteName={modalStates.selectedParticipanteName}
          />

          <ConfirmDeleteModal
            isOpen={modalStates.showDeleteModal}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            participante={modalStates.participanteToDelete}
            loading={deleteLoading}
          />

          <DocumentosModal
            isOpen={documentModalState.showDocumentModal}
            onClose={handleCloseDocumentModal}
            documentPath={documentModalState.selectedDocument}
            documentType={documentModalState.documentType}
            participanteName={documentModalState.selectedParticipanteName}
          />
        </div>
      </main>
    </div>
  );
}