import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CategoriaForm from "../components/Categorias/CategoriaForm";
import CategoriaTable from "../components/Categorias/CategoriaTable";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import useCategoria from "../hooks/useCategoria";

export default function Categoria() {
  const {
    // Estado del formulario
    form,
    handleChange,
    handleSubmit,

    // Estado de la lista
    categorias,
    loading,
    fetchCategorias,

    // Estado de modales
    modalOpen,
    editingCategoria,
    deleteModalOpen,
    categoriaToDelete,

    // Funciones para modales
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useCategoria();

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main content with responsive padding */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 animate-fade-in lg:ml-0">
        {/* Header section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow">
            <h1 className="text-2xl sm:text-3xl font-bold text-lime-500 mb-3 sm:mb-4">
              Categorías
            </h1>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              Aquí podrás gestionar las categorías de las carreras.
            </p>

            {/* Add button - responsive */}
            <button
              type="button"
              onClick={openCreateModal}
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-sm sm:text-base">Agregar Nueva Categoría</span>
            </button>
          </div>
        </div>

        {/* Table/Cards section */}
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow mb-4 sm:mb-6">
          <CategoriaTable
            categorias={categorias}
            loading={loading}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
          
          {/* Total count - responsive */}
          {categorias.length > 0 && (
            <div className="mt-4 bg-white rounded-lg shadow p-3 sm:p-4 border-t border-b border-gray-600">
              <div className="text-xs sm:text-sm text-gray-500">
                Total de categorías:{" "}
                <span className="font-medium text-gray-900">
                  {categorias.length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal para crear/editar categoría */}
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
          size="md"
        >
          <CategoriaForm
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            editingCategoria={editingCategoria}
          />
        </Modal>

        {/* Modal de confirmación para eliminar */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Eliminar Categoría"
          message={`¿Está seguro que desea eliminar la categoría "${categoriaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
          loading={loading}
        />
      </div>
    </div>
  );
}