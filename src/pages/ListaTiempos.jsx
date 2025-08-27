import React, { useState, useEffect } from 'react';
import { Clock, Edit, Trash2, Search, Filter, AlertTriangle, CheckCircle, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useListaTiempos } from '../hooks/useListaTiempos';
import EditTiempoModal from '../components/ListaTiempos/EditTiempoModal';
import DeleteConfirmModal from '../components/ListaTiempos/DeleteConfirmModal';
import FiltrosTiempos from '../components/ListaTiempos/FiltrosTiempos';
import TablaTiempos from '../components/ListaTiempos/TablaTiempos';
import EstadisticasTiempos from '../components/ListaTiempos/EstadisticasTiempos';

const ListaTiempos = () => {
  const {
    tiempos,
    etapas,
    categorias,
    participantes,
    loading,
    filtros,
    estadisticas,
    updateFiltros,
    fetchTiempos,
    updateTiempo,
    deleteTiempo,
    refreshData
  } = useListaTiempos();

  const [tiempoSeleccionado, setTiempoSeleccionado] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filtrar tiempos por búsqueda
  const tiemposFiltrados = tiempos.filter(tiempo => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const participante = tiempo.participantes;
    
    return (
      participante?.nombre?.toLowerCase().includes(searchLower) ||
      participante?.apellidos?.toLowerCase().includes(searchLower) ||
      participante?.dorsal?.toLowerCase().includes(searchLower) ||
      participante?.ci?.toLowerCase().includes(searchLower)
    );
  });

  const handleEditTiempo = (tiempo) => {
    setTiempoSeleccionado(tiempo);
    setShowEditModal(true);
  };

  const handleDeleteTiempo = (tiempo) => {
    setTiempoSeleccionado(tiempo);
    setShowDeleteModal(true);
  };

  const handleSaveEdit = async (tiempoData) => {
    const result = await updateTiempo(tiempoSeleccionado.id, tiempoData);
    if (result.success) {
      setShowEditModal(false);
      setTiempoSeleccionado(null);
      await fetchTiempos();
    }
    return result;
  };

  const handleConfirmDelete = async () => {
    const result = await deleteTiempo(tiempoSeleccionado.id);
    if (result.success) {
      setShowDeleteModal(false);
      setTiempoSeleccionado(null);
      await fetchTiempos();
    }
    return result;
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setTiempoSeleccionado(null);
  };

  if (loading && tiempos.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-lime-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 text-sm sm:text-base">Cargando tiempos...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-md"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Sidebar with mobile overlay */}
      <Sidebar />

      <main className="flex-1 p-3 sm:p-6 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 bg-white p-4 sm:p-6 rounded-lg shadow space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-lime-600" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
                    Gestión de Tiempos
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                    Editar, eliminar y gestionar tiempos registrados
                  </p>
                </div>
              </div>
              
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                <Clock className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
                <span className="sm:hidden">Actualizar</span>
              </button>
            </div>

            {/* Estadísticas */}
            <EstadisticasTiempos estadisticas={estadisticas} />
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col space-y-4">
              {/* Búsqueda */}
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar por participante, dorsal o CI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="w-full">
                <FiltrosTiempos
                  etapas={etapas}
                  categorias={categorias}
                  filtros={filtros}
                  onFiltrosChange={updateFiltros}
                />
              </div>
            </div>
          </div>

          {/* Tabla de tiempos */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-base sm:text-lg font-semibold">
                  Tiempos Registrados ({tiemposFiltrados.length})
                </h2>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <Filter className="h-4 w-4 flex-shrink-0" />
                  <span>Total: {tiempos.length} registros</span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              <TablaTiempos
                tiempos={tiemposFiltrados}
                onEdit={handleEditTiempo}
                onDelete={handleDeleteTiempo}
                loading={loading}
              />
            </div>
          </div>

          {/* Modales */}
          {showEditModal && (
            <EditTiempoModal
              tiempo={tiempoSeleccionado}
              participantes={participantes}
              etapas={etapas}
              onSave={handleSaveEdit}
              onClose={handleCloseModals}
            />
          )}

          {showDeleteModal && (
            <DeleteConfirmModal
              tiempo={tiempoSeleccionado}
              onConfirm={handleConfirmDelete}
              onClose={handleCloseModals}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ListaTiempos;